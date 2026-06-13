/**
 * The metaball scalar field.
 *
 * field(p) = Σ kernelᵢ(|p − cᵢ|).  Surface = { p : field(p) = threshold }.
 *
 * Every kernel here is calibrated so that a LONE blob's isosurface lands
 * exactly on its visual radius `r` at the active threshold — see
 * `unitRadiusAtThreshold`. That decouples "how big is this blob" from "how
 * far does it reach to merge", which is the threshold's real job.
 */

import type { Blob, GooKernel } from './types'

/** Radius (in units of R/σ) at which the *unit* kernel equals `threshold`. */
export function unitRadiusAtThreshold(kernel: GooKernel, threshold: number): number {
  const T = Math.min(Math.max(threshold, 1e-4), 0.999)
  switch (kernel) {
    case 'cubic':
      // (1 − rt²)³ = T  →  rt = √(1 − ∛T)
      return Math.sqrt(Math.max(1 - Math.cbrt(T), 0))
    case 'gaussian':
      // exp(−rt²) = T  →  rt = √(−ln T)
      return Math.sqrt(-Math.log(T))
    case 'inverseSquare':
      // handled analytically in eval; lone-blob radius is exact at any T
      return 1
  }
}

/** Per-blob, per-kernel constants so eval is a tight inner loop. */
export interface FieldKernelCache {
  kernel: GooKernel
  threshold: number
  rt: number
}

export function makeKernelCache(kernel: GooKernel, threshold: number): FieldKernelCache {
  return { kernel, threshold, rt: unitRadiusAtThreshold(kernel, threshold) }
}

/**
 * Field value at (px,py). Sums every blob.
 * cubic/gaussian use support/σ = r / rt so the lone-blob isosurface = r.
 * inverseSquare uses weight T·r² so the lone-blob isosurface = r at threshold T.
 */
export function fieldAt(px: number, py: number, blobs: Blob[], c: FieldKernelCache): number {
  let sum = 0
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]
    const dx = px - b.x
    const dy = py - b.y
    const d2 = dx * dx + dy * dy
    switch (c.kernel) {
      case 'cubic': {
        const R = b.r / c.rt
        const s = d2 / (R * R)
        if (s < 1) {
          const u = 1 - s
          sum += u * u * u
        }
        break
      }
      case 'gaussian': {
        const sigma = b.r / c.rt
        const s = d2 / (sigma * sigma)
        if (s < 9) sum += Math.exp(-s) // cut at 3σ
        break
      }
      case 'inverseSquare': {
        // weight so value at d = r equals threshold T
        sum += (c.threshold * b.r * b.r) / Math.max(d2, 1e-3)
        break
      }
    }
  }
  return sum
}

/** ∇field at (px,py) — points toward higher density (i.e. inward). The
 *  outward surface normal is −∇field / |∇field|. */
export function fieldGradient(
  px: number,
  py: number,
  blobs: Blob[],
  c: FieldKernelCache
): [number, number] {
  let gx = 0
  let gy = 0
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i]
    const dx = px - b.x
    const dy = py - b.y
    const d2 = dx * dx + dy * dy
    switch (c.kernel) {
      case 'cubic': {
        const R = b.r / c.rt
        const s = d2 / (R * R)
        if (s < 1) {
          const k = (-6 * (1 - s) * (1 - s)) / (R * R)
          gx += k * dx
          gy += k * dy
        }
        break
      }
      case 'gaussian': {
        const sigma = b.r / c.rt
        const s2 = sigma * sigma
        const s = d2 / s2
        if (s < 9) {
          const k = (-2 / s2) * Math.exp(-s)
          gx += k * dx
          gy += k * dy
        }
        break
      }
      case 'inverseSquare': {
        const d4 = Math.max(d2 * d2, 1e-6)
        const k = (-2 * c.threshold * b.r * b.r) / d4
        gx += k * dx
        gy += k * dy
        break
      }
    }
  }
  return [gx, gy]
}
