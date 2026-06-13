/**
 * CPU rasterizer — web backend.
 *
 * Walks every pixel of the slab, runs SDF → normal → Snell, and writes two
 * RGBA buffers:
 *
 *  1. displacement map  — consumed by SVG <feDisplacementMap> applied through
 *     `backdrop-filter: url(#…)`. R = x offset, G = y offset, biased around
 *     127.5 ("mid-gray = don't move").
 *  2. highlight map     — white RGBA whose alpha is the specular term,
 *     composited over the glass as a background-image.
 *
 * Cost: O(w·h) with ~20 flops/px. A 400×300 card at scale 1 is ~120k px,
 * well under a millisecond of work in practice, and it only reruns on
 * resize/option change — never per frame.
 */

import { clampRadius, sdRoundedBox, sdRoundedBoxGradient } from './geometry'
import { surfaceNormal } from './surface'
import { refractDisplacement, specularIntensity } from './refraction'
import { resolveOptions } from './types'
import type { GlassFieldMaps, GlassGeometry, GlassOptions } from './types'

export interface RasterizeConfig {
  /** Supersampling scale (use devicePixelRatio capped at 2). */
  scale?: number
}

export function rasterizeGlassField(
  geometry: GlassGeometry,
  options?: Partial<GlassOptions>,
  config: RasterizeConfig = {}
): GlassFieldMaps {
  const opts = resolveOptions(options)
  const scale = Math.min(Math.max(config.scale ?? 1, 0.5), 3)

  const w = Math.max(2, Math.round(geometry.width * scale))
  const h = Math.max(2, Math.round(geometry.height * scale))
  const bx = geometry.width / 2
  const by = geometry.height / 2
  const radius = clampRadius(geometry.width, geometry.height, geometry.radius)
  const bezel = Math.min(opts.bezelWidth, Math.min(bx, by))

  const dispX = new Float32Array(w * h)
  const dispY = new Float32Array(w * h)
  const highlight = new Uint8ClampedArray(w * h * 4)

  let maxDisp = 0

  for (let y = 0; y < h; y++) {
    // sample at pixel centers, in CSS-px space relative to the slab center
    const py = (y + 0.5) / scale - by
    for (let x = 0; x < w; x++) {
      const px = (x + 0.5) / scale - bx
      const i = y * w + x

      const d = sdRoundedBox(px, py, bx, by, radius)
      if (d > 0) continue // outside the slab — clipped by border-radius anyway
      if (-d > bezel) continue // flat plateau — zero displacement by construction

      const [gx, gy] = sdRoundedBoxGradient(px, py, bx, by, radius)
      const n = surfaceNormal(d, gx, gy, bezel, opts.depth, opts.profile)
      // The ray refracts at the curved surface but the backdrop sits beneath
      // the FULL slab, so its vertical travel is always `depth`.
      const [dx, dy] = refractDisplacement(n.nx, n.ny, n.nz, opts.depth, opts.ior)

      dispX[i] = dx
      dispY[i] = dy
      const m = Math.max(Math.abs(dx), Math.abs(dy))
      if (m > maxDisp) maxDisp = m

      const s = specularIntensity(n.nx, n.ny, n.nz, opts.specular)
      if (s > 0.004) {
        const o = i * 4
        highlight[o] = 255
        highlight[o + 1] = 255
        highlight[o + 2] = 255
        highlight[o + 3] = Math.min(255, Math.round(s * 255))
      }
    }
  }

  // Encode displacement around mid-gray. feDisplacementMap computes:
  //   offset = scaleAttr · (channel/255 − 0.5)
  // so with scaleAttr = 2·maxDisp, channel = 127.5 + 127.5·(d/maxDisp)
  // round-trips exactly back to px.
  const displacement = new Uint8ClampedArray(w * h * 4)
  const inv = maxDisp > 0 ? 127.5 / maxDisp : 0
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    displacement[o] = 127.5 + dispX[i] * inv
    displacement[o + 1] = 127.5 + dispY[i] * inv
    displacement[o + 2] = 127.5
    displacement[o + 3] = 255
  }

  return { width: w, height: h, scale, displacement, maxDisplacement: maxDisp, highlight }
}
