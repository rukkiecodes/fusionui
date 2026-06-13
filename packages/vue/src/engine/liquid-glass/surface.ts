/**
 * The glass surface model.
 *
 * Liquid glass is a flat slab with a convex "lens" bezel around the rim:
 *
 *        height
 *          ▲ ____________________ depth (flat plateau → no distortion)
 *          |/                    \
 *          /                      \      ← circular bezel cross-section
 *   ______/                        \______
 *         ↑ edge (sdf = 0)   ↑ plateau starts (sdf = -bezelWidth)
 *
 * Inside the bezel band the height rises from 0 to `depth` following the
 * profile. The surface NORMAL is reconstructed from the height gradient,
 * which factors neatly via the chain rule:
 *
 *   H(x,y)   = depth · h(t),  t = clamp(-sdf / bezel, 0, 1)
 *   ∇H       = depth · h'(t) · ∇t = -(depth / bezel) · h'(t) · ∇sdf
 *   normal   = normalize(-∂H/∂x, -∂H/∂y, 1)
 */

import type { BezelProfile } from './types'

export interface SurfaceSample {
  /** Normalized height 0..1 (multiply by depth for px). */
  h: number
  /** dh/dt of the normalized profile. */
  dhdt: number
}

/**
 * Bezel cross-section.
 * - 'lens'   : quarter-circle, h = sqrt(1 - (1-t)²). Infinite slope at the
 *              very edge (t=0) — that's the bright, hard light-bend ring you
 *              see on iOS 26. Slope is clamped numerically.
 * - 'smooth' : smoothstep, gentle and cheap.
 */
export function bezelProfile(t: number, profile: BezelProfile): SurfaceSample {
  if (t <= 0) return { h: 0, dhdt: profile === 'lens' ? 8 : 0 }
  if (t >= 1) return { h: 1, dhdt: 0 }
  if (profile === 'lens') {
    const u = 1 - t
    const h = Math.sqrt(Math.max(1 - u * u, 0))
    return { h, dhdt: Math.min(u / Math.max(h, 1e-3), 8) }
  }
  // smoothstep
  return { h: t * t * (3 - 2 * t), dhdt: 6 * t * (1 - t) }
}

export interface NormalSample {
  nx: number
  ny: number
  nz: number
  /** Absolute surface height in px at this point. */
  height: number
}

/**
 * Surface normal at a point, given its sdf value/gradient.
 *
 * @param d        signed distance (≤ 0 inside)
 * @param gx,gy    unit SDF gradient (outward)
 * @param bezel    bezel width px
 * @param depth    slab thickness px
 */
export function surfaceNormal(
  d: number,
  gx: number,
  gy: number,
  bezel: number,
  depth: number,
  profile: BezelProfile
): NormalSample {
  const t = Math.min(Math.max(-d / Math.max(bezel, 1e-3), 0), 1)
  const { h, dhdt } = bezelProfile(t, profile)
  // ∇H = -(depth / bezel) · h'(t) · ∇sdf
  const s = (depth / Math.max(bezel, 1e-3)) * dhdt
  const dHx = -gx * s
  const dHy = -gy * s
  // n = normalize(-∇H, 1)
  const nx = -dHx
  const ny = -dHy
  const nz = 1
  const l = Math.hypot(nx, ny, nz)
  return { nx: nx / l, ny: ny / l, nz: nz / l, height: depth * h }
}
