/**
 * The light bending.
 *
 * For every pixel on the glass we trace a single view ray straight down
 * (I = (0,0,-1)), refract it at the curved top surface using Snell's law,
 * and let the bent ray travel down through the slab until it hits the
 * backdrop plane. The lateral offset where it lands is the displacement —
 * "what pixel of the background actually shows through here".
 *
 *      eye
 *       │ I = (0,0,-1)
 *       ▼
 *   ────●──── curved surface, normal n
 *        \
 *         \  refracted ray T (Snell, η = 1/ior)
 *          \
 *   ────────●──── backdrop plane (offset = T.xy · height / -T.z)
 */

import type { SpecularOptions } from './types'

/**
 * Refraction displacement in px.
 * Flat plateau (n = +z) ⇒ T = -z ⇒ zero displacement: the middle of the
 * glass is perfectly readable, only the rim bends light. Exactly the iOS
 * behavior.
 */
export function refractDisplacement(
  nx: number,
  ny: number,
  nz: number,
  height: number,
  ior: number
): [number, number] {
  const eta = 1 / ior
  // I = (0,0,-1); cos(θi) = -dot(n, I) = nz
  const cosi = nz
  const k = 1 - eta * eta * (1 - cosi * cosi)
  if (k <= 0) return [0, 0] // total internal reflection — can't occur entering glass, guard anyway
  const f = eta * cosi - Math.sqrt(k)
  // T = η·I + f·n
  const tx = f * nx
  const ty = f * ny
  const tz = -eta + f * nz // η·(-1) + f·nz, always < 0 (downward)
  const travel = height / Math.max(-tz, 1e-4)
  return [tx * travel, ty * travel]
}

/**
 * Blinn–Phong rim highlight. View dir is +z, light dir comes from options.
 * Returns 0..1 intensity.
 */
export function specularIntensity(
  nx: number,
  ny: number,
  nz: number,
  spec: SpecularOptions
): number {
  const [lx, ly, lz] = spec.lightDir
  // half vector between view (0,0,1) and light (pointing surface→light = -L)
  let hx = -lx
  let hy = -ly
  let hz = -lz + 1
  const hl = Math.hypot(hx, hy, hz) || 1
  hx /= hl
  hy /= hl
  hz /= hl
  const ndoth = Math.max(nx * hx + ny * hy + nz * hz, 0)
  // suppress highlight on the flat plateau (nz≈1 there gives a residual sheen)
  const rim = 1 - nz * nz
  return Math.pow(ndoth, spec.shininess) * spec.intensity * Math.min(rim * 6, 1)
}
