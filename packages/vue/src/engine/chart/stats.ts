/**
 * Small statistics helpers commonly needed when wiring data into scales.
 */

/** Min/max of an accessor over data. Returns [NaN,NaN] if empty. */
export function extent<T>(
  data: T[],
  accessor: (d: T) => number = d => d as unknown as number
): [number, number] {
  let min = Infinity
  let max = -Infinity
  for (const d of data) {
    const v = accessor(d)
    if (Number.isFinite(v)) {
      if (v < min) min = v
      if (v > max) max = v
    }
  }
  return min === Infinity ? [NaN, NaN] : [min, max]
}

export interface Bin {
  x0: number
  x1: number
  count: number
  values: number[]
}

/**
 * Histogram bins over [domainMin, domainMax] (defaults to data extent) using
 * `thresholds` equal-width bins (Sturges-ish default).
 */
export function bin(values: number[], thresholds?: number, domain?: [number, number]): Bin[] {
  const finite = values.filter(Number.isFinite)
  if (!finite.length) return []
  const [d0, d1] = domain ?? extent(finite)
  const k = thresholds ?? Math.ceil(Math.log2(finite.length) + 1)
  const width = (d1 - d0) / k || 1
  const bins: Bin[] = Array.from({ length: k }, (_, i) => ({
    x0: d0 + i * width,
    x1: d0 + (i + 1) * width,
    count: 0,
    values: [],
  }))
  for (const v of finite) {
    let i = Math.floor((v - d0) / width)
    if (i < 0) i = 0
    if (i >= k) i = k - 1
    bins[i].count++
    bins[i].values.push(v)
  }
  return bins
}

export interface RegressionLine {
  slope: number
  intercept: number
  /** y = slope·x + intercept */
  predict: (x: number) => number
  r2: number
}

/** Ordinary least-squares line through (x,y) points. */
export function linearRegression(points: Array<[number, number]>): RegressionLine {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: n ? points[0][1] : 0, predict: () => 0, r2: 0 }
  let sx = 0,
    sy = 0,
    sxx = 0,
    sxy = 0,
    syy = 0
  for (const [x, y] of points) {
    sx += x
    sy += y
    sxx += x * x
    sxy += x * y
    syy += y * y
  }
  const denom = n * sxx - sx * sx || 1e-12
  const slope = (n * sxy - sx * sy) / denom
  const intercept = (sy - slope * sx) / n
  const ssTot = syy - (sy * sy) / n || 1e-12
  const ssRes = points.reduce((acc, [x, y]) => acc + (y - (slope * x + intercept)) ** 2, 0)
  return { slope, intercept, predict: x => slope * x + intercept, r2: 1 - ssRes / ssTot }
}
