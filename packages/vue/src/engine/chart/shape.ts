/**
 * Shape generators — compose scaled points into the geometry of a chart.
 * Each returns PathCommand[] (or data + commands) so it renders on any backend.
 *
 *   line   — a series as a curve
 *   area   — a series filled to a baseline (supports stacking)
 *   stack  — offsets for stacked/percentage/streamgraph charts
 *   bars   — rects from a band scale
 *   pie    — angle layout; arc — a wedge between two radii
 */

import type { PathCommand } from './path'
import { curveLinear, type Curve, type Point } from './curve'

// ---- line ----
export interface LineOptions {
  curve?: Curve
}
/** A polyline/curve through already-scaled pixel points. */
export function line(points: Point[], opts: LineOptions = {}): PathCommand[] {
  const c = opts.curve ?? curveLinear
  return c(points.filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1])))
}

// ---- area ----
export interface AreaOptions {
  curve?: Curve
}
/**
 * Filled area between an upper line (x,y1) and a baseline (x,y0). The baseline
 * is traced in reverse and the path closed, so stacked bands sit flush.
 */
export function area(upper: Point[], lower: Point[], opts: AreaOptions = {}): PathCommand[] {
  const c = opts.curve ?? curveLinear
  const top = c(upper)
  if (!top.length) return []
  const bottomPts = lower.slice().reverse()
  const bottom = c(bottomPts)
  // re-tag the bottom's leading M as an L so it connects to the top
  const bottomConnected: PathCommand[] = bottom.map((cmd, i) =>
    i === 0 && cmd.type === 'M' ? { type: 'L', x: cmd.x, y: cmd.y } : cmd
  )
  return [...top, ...bottomConnected, { type: 'Z' }]
}

// ---- stack ----
export type StackOffset = 'none' | 'expand' | 'silhouette' | 'wiggle'
export type StackOrder = 'none' | 'reverse' | 'ascending' | 'descending'

export interface StackResult {
  /** series[i][j] = [y0, y1] stacked bounds for series i at index j. */
  series: Array<Array<[number, number]>>
  order: number[]
}

/**
 * Compute stacked [y0,y1] bounds for a matrix of values (seriesValues[i][j]).
 *  • 'none'       — cumulative from zero
 *  • 'expand'     — normalised so each column sums to 1 (percentage)
 *  • 'silhouette' — centred (streamgraph)
 *  • 'wiggle'     — minimal-slope streamgraph
 */
export function stack(
  seriesValues: number[][],
  offset: StackOffset = 'none',
  order: StackOrder = 'none'
): StackResult {
  const m = seriesValues.length
  const n = m ? seriesValues[0].length : 0
  const idx = orderIndices(seriesValues, order)
  const series: Array<Array<[number, number]>> = Array.from({ length: m }, () => new Array(n))

  for (let j = 0; j < n; j++) {
    let y0 = 0
    for (let oi = 0; oi < m; oi++) {
      const i = idx[oi]
      const v = seriesValues[i][j] || 0
      series[i][j] = [y0, y0 + v]
      y0 += v
    }
  }

  if (offset === 'expand') {
    for (let j = 0; j < n; j++) {
      let total = 0
      for (let i = 0; i < m; i++) total += seriesValues[i][j] || 0
      const k = total || 1
      for (let i = 0; i < m; i++) series[i][j] = [series[i][j][0] / k, series[i][j][1] / k]
    }
  } else if (offset === 'silhouette') {
    for (let j = 0; j < n; j++) {
      let total = 0
      for (let i = 0; i < m; i++) total += seriesValues[i][j] || 0
      const shift = total / 2
      for (let i = 0; i < m; i++) series[i][j] = [series[i][j][0] - shift, series[i][j][1] - shift]
    }
  } else if (offset === 'wiggle') {
    // Byron–Wattenberg minimal-wiggle baseline
    const shift = new Array(n).fill(0)
    for (let j = 1; j < n; j++) {
      let sumDelta = 0
      let weighted = 0
      let belowSum = 0
      for (let oi = 0; oi < m; oi++) {
        const i = idx[oi]
        const cur = seriesValues[i][j] || 0
        const prev = seriesValues[i][j - 1] || 0
        const dPrime = cur - prev
        weighted += (belowSum + dPrime / 2) * dPrime
        sumDelta += cur
        belowSum += dPrime
      }
      shift[j] = shift[j - 1] - (sumDelta ? weighted / sumDelta : 0)
    }
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++)
        series[i][j] = [series[i][j][0] + shift[j], series[i][j][1] + shift[j]]
    }
  }

  return { series, order: idx }
}

function orderIndices(values: number[][], order: StackOrder): number[] {
  const m = values.length
  const idx = Array.from({ length: m }, (_, i) => i)
  if (order === 'reverse') return idx.reverse()
  const sums = values.map(s => s.reduce((a, b) => a + (b || 0), 0))
  if (order === 'ascending') return idx.sort((a, b) => sums[a] - sums[b])
  if (order === 'descending') return idx.sort((a, b) => sums[b] - sums[a])
  return idx
}

// ---- bars ----
export interface Bar {
  x: number
  y: number
  width: number
  height: number
}
/**
 * Rects for a categorical series. `band` is a band scale, `valueScale` a
 * continuous scale, `baseline` the pixel value of zero (valueScale(0)).
 */
export function bars(
  data: Array<{ key: string | number; value: number }>,
  band: (k: string | number) => number | undefined,
  bandwidth: number,
  valueScale: (v: number) => number,
  baseline: number
): Bar[] {
  const out: Bar[] = []
  for (const d of data) {
    const x = band(d.key)
    if (x === undefined) continue
    const y = valueScale(d.value)
    out.push({ x, y: Math.min(y, baseline), width: bandwidth, height: Math.abs(baseline - y) })
  }
  return out
}

/** A rounded-rect bar as path commands (uniform corner radius). */
export function barPath(b: Bar, radius = 0): PathCommand[] {
  const r = Math.min(radius, b.width / 2, b.height / 2)
  if (r <= 0) {
    return [
      { type: 'M', x: b.x, y: b.y },
      { type: 'L', x: b.x + b.width, y: b.y },
      { type: 'L', x: b.x + b.width, y: b.y + b.height },
      { type: 'L', x: b.x, y: b.y + b.height },
      { type: 'Z' },
    ]
  }
  const { x, y, width: w, height: h } = b
  return [
    { type: 'M', x: x + r, y },
    { type: 'L', x: x + w - r, y },
    { type: 'ARC', cx: x + w - r, cy: y + r, r, a0: -Math.PI / 2, a1: 0 },
    { type: 'L', x: x + w, y: y + h - r },
    { type: 'ARC', cx: x + w - r, cy: y + h - r, r, a0: 0, a1: Math.PI / 2 },
    { type: 'L', x: x + r, y: y + h },
    { type: 'ARC', cx: x + r, cy: y + h - r, r, a0: Math.PI / 2, a1: Math.PI },
    { type: 'L', x, y: y + r },
    { type: 'ARC', cx: x + r, cy: y + r, r, a0: Math.PI, a1: (3 * Math.PI) / 2 },
    { type: 'Z' },
  ]
}

// ---- pie / arc ----
export interface PieSlice {
  index: number
  value: number
  startAngle: number
  endAngle: number
}
export interface PieOptions {
  startAngle?: number // default top
  endAngle?: number
  padAngle?: number
}
/** Lay out values as angular slices (default starts at top, clockwise). */
export function pie(values: number[], opts: PieOptions = {}): PieSlice[] {
  const start = opts.startAngle ?? -Math.PI / 2
  const end = opts.endAngle ?? start + Math.PI * 2
  const pad = opts.padAngle ?? 0
  const total = values.reduce((a, b) => a + Math.max(0, b), 0) || 1
  const available = end - start - pad * values.length
  let a = start
  return values.map((v, index) => {
    const span = (Math.max(0, v) / total) * available
    const slice: PieSlice = {
      index,
      value: v,
      startAngle: a + pad / 2,
      endAngle: a + pad / 2 + span,
    }
    a += span + pad
    return slice
  })
}

/** A wedge (donut segment) between innerRadius and outerRadius. */
export function arc(
  slice: { startAngle: number; endAngle: number },
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number
): PathCommand[] {
  const { startAngle: a0, endAngle: a1 } = slice
  const x0 = cx + outerRadius * Math.cos(a0)
  const y0 = cy + outerRadius * Math.sin(a0)
  if (innerRadius <= 0) {
    return [
      { type: 'M', x: cx, y: cy },
      { type: 'L', x: x0, y: y0 },
      { type: 'ARC', cx, cy, r: outerRadius, a0, a1 },
      { type: 'Z' },
    ]
  }
  const xi = cx + innerRadius * Math.cos(a1)
  const yi = cy + innerRadius * Math.sin(a1)
  return [
    { type: 'M', x: x0, y: y0 },
    { type: 'ARC', cx, cy, r: outerRadius, a0, a1 },
    { type: 'L', x: xi, y: yi },
    { type: 'ARC', cx, cy, r: innerRadius, a0: a1, a1: a0 },
    { type: 'Z' },
  ]
}
