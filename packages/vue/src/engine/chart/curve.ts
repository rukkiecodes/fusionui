/**
 * Curve interpolators — turn a sequence of points into path commands.
 *
 * The one that matters for charts is **monotone cubic** (Fritsch–Carlson).
 * A naive cubic spline (Catmull-Rom, natural) overshoots between points: feed
 * it [0, 0, 10, 0, 0] and the curve dips below zero and rises above ten,
 * drawing minima and maxima that aren't in the data. On a chart that's a lie.
 * Monotone cubic limits the tangents so the curve stays within the envelope
 * of its surrounding points — it never invents an extremum. We verify exactly
 * that (no sample leaves the per-segment data range) in the test suite.
 *
 * All curves emit `PathCommand[]` (M/L/C), so they render identically through
 * the SVG, Canvas, and Skia backends.
 */

import type { PathCommand } from './path'

export type Point = [number, number]
export type Curve = (points: Point[]) => PathCommand[]

function moveLine(points: Point[]): PathCommand[] {
  const out: PathCommand[] = []
  points.forEach((p, i) =>
    out.push(i === 0 ? { type: 'M', x: p[0], y: p[1] } : { type: 'L', x: p[0], y: p[1] })
  )
  return out
}

export const curveLinear: Curve = points => (points.length ? moveLine(points) : [])

/** Step curves: hold value then jump. */
export const curveStepAfter: Curve = points => {
  if (!points.length) return []
  const out: PathCommand[] = [{ type: 'M', x: points[0][0], y: points[0][1] }]
  for (let i = 1; i < points.length; i++) {
    out.push({ type: 'L', x: points[i][0], y: points[i - 1][1] })
    out.push({ type: 'L', x: points[i][0], y: points[i][1] })
  }
  return out
}
export const curveStepBefore: Curve = points => {
  if (!points.length) return []
  const out: PathCommand[] = [{ type: 'M', x: points[0][0], y: points[0][1] }]
  for (let i = 1; i < points.length; i++) {
    out.push({ type: 'L', x: points[i - 1][0], y: points[i][1] })
    out.push({ type: 'L', x: points[i][0], y: points[i][1] })
  }
  return out
}
/** Step at the midpoint between samples. */
export const curveStep: Curve = points => {
  if (!points.length) return []
  const out: PathCommand[] = [{ type: 'M', x: points[0][0], y: points[0][1] }]
  for (let i = 1; i < points.length; i++) {
    const mx = (points[i - 1][0] + points[i][0]) / 2
    out.push({ type: 'L', x: mx, y: points[i - 1][1] })
    out.push({ type: 'L', x: mx, y: points[i][1] })
    out.push({ type: 'L', x: points[i][0], y: points[i][1] })
  }
  return out
}

/**
 * Monotone cubic (Fritsch–Carlson) — chart-safe, no overshoot.
 * Assumes x strictly increasing.
 */
export const curveMonotoneX: Curve = points => {
  const n = points.length
  if (n < 2) return moveLine(points)
  if (n === 2) return moveLine(points)

  const xs = points.map(p => p[0])
  const ys = points.map(p => p[1])
  const dx: number[] = []
  const delta: number[] = [] // secant slopes
  for (let i = 0; i < n - 1; i++) {
    dx[i] = xs[i + 1] - xs[i]
    delta[i] = (ys[i + 1] - ys[i]) / (dx[i] || 1e-12)
  }

  // initial tangents: average of adjacent secants; endpoints use the secant
  const m: number[] = new Array(n)
  m[0] = delta[0]
  m[n - 1] = delta[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      m[i] = 0 // local extremum → flat tangent (this is what kills overshoot)
    } else {
      m[i] = (delta[i - 1] + delta[i]) / 2
    }
  }

  // Fritsch–Carlson limiter: keep (α,β) inside the monotonicity circle r=3
  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / delta[i]
    const b = m[i + 1] / delta[i]
    const s = a * a + b * b
    if (s > 9) {
      const t = 3 / Math.sqrt(s)
      m[i] = t * a * delta[i]
      m[i + 1] = t * b * delta[i]
    }
  }

  // tangents → cubic bézier control points (Hermite to Bézier)
  const out: PathCommand[] = [{ type: 'M', x: xs[0], y: ys[0] }]
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i]
    out.push({
      type: 'C',
      x1: xs[i] + h / 3,
      y1: ys[i] + (m[i] * h) / 3,
      x2: xs[i + 1] - h / 3,
      y2: ys[i + 1] - (m[i + 1] * h) / 3,
      x: xs[i + 1],
      y: ys[i + 1],
    })
  }
  return out
}

/**
 * Catmull–Rom (centripetal, α=0.5 by default) — smooth and organic, but it
 * CAN overshoot, so it's for aesthetic curves, not honest data lines.
 */
export function curveCatmullRom(alpha = 0.5): Curve {
  return points => {
    const n = points.length
    if (n < 2) return moveLine(points)
    const out: PathCommand[] = [{ type: 'M', x: points[0][0], y: points[0][1] }]
    const pt = (i: number): Point => points[Math.max(0, Math.min(n - 1, i))]
    for (let i = 0; i < n - 1; i++) {
      const p0 = pt(i - 1)
      const p1 = pt(i)
      const p2 = pt(i + 1)
      const p3 = pt(i + 2)
      const d1 = Math.max(1e-6, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) ** alpha)
      const d2 = Math.max(1e-6, Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) ** alpha)
      const d3 = Math.max(1e-6, Math.hypot(p3[0] - p2[0], p3[1] - p2[1]) ** alpha)
      // centripetal CR → bézier control points
      const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * (d2 / d1)
      const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * (d2 / d1)
      const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * (d2 / d3)
      const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * (d2 / d3)
      out.push({ type: 'C', x1: c1x, y1: c1y, x2: c2x, y2: c2y, x: p2[0], y: p2[1] })
    }
    return out
  }
}

/** Uniform B-spline (basis) — very smooth, does not pass through points. */
export const curveBasis: Curve = points => {
  const n = points.length
  if (n < 2) return moveLine(points)
  if (n === 2) return moveLine(points)
  const px = (i: number) => points[Math.max(0, Math.min(n - 1, i))][0]
  const py = (i: number) => points[Math.max(0, Math.min(n - 1, i))][1]
  const out: PathCommand[] = []
  // first on-curve point
  out.push({ type: 'M', x: (px(0) + 4 * px(0) + px(1)) / 6, y: (py(0) + 4 * py(0) + py(1)) / 6 })
  for (let i = 1; i < n; i++) {
    const x0 = px(i - 1),
      x1 = px(i),
      x2 = px(i + 1)
    const y0 = py(i - 1),
      y1 = py(i),
      y2 = py(i + 1)
    out.push({
      type: 'C',
      x1: (2 * x0 + x1) / 3,
      y1: (2 * y0 + y1) / 3,
      x2: (x0 + 2 * x1) / 3,
      y2: (y0 + 2 * y1) / 3,
      x: (x0 + 4 * x1 + x2) / 6,
      y: (y0 + 4 * y1 + y2) / 6,
    })
  }
  return out
}

/** Look up a curve by name (handy for prop-driven components). */
export const curves = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  catmullRom: curveCatmullRom(0.5),
  step: curveStep,
  stepBefore: curveStepBefore,
  stepAfter: curveStepAfter,
  basis: curveBasis,
} as const
export type CurveName = keyof typeof curves
