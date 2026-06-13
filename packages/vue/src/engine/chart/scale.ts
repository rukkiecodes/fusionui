/**
 * Scales — map data space ⇄ pixel space.
 *
 * A scale is the single most important primitive in a chart: it turns a value
 * into a coordinate, and (just as important) a coordinate back into a value
 * for hit-testing and tooltips. Every scale here round-trips exactly:
 * `s.invert(s(v)) === v`. Continuous scales (linear/log/time) also generate
 * nice ticks and can round their own domain.
 *
 * Band/point scales handle categorical axes (bars, ordinal x): they tile the
 * range into evenly padded slots and report each slot's width (`bandwidth`).
 */

import {
  ticks as genTicks,
  niceDomain,
  tickStep,
  formatNumber,
  timeTicks,
  formatTime,
} from './ticks'

export interface ContinuousScale {
  (v: number): number
  invert(px: number): number
  domain(): [number, number]
  range(): [number, number]
  ticks(count?: number): number[]
  tickFormat(count?: number): (v: number) => string
  nice(count?: number): ContinuousScale
  clamp(on: boolean): ContinuousScale
  copy(): ContinuousScale
}

function makeLinearish(
  d: [number, number],
  r: [number, number],
  clamped: boolean,
  fwd: (v: number) => number, // data → normalised transform (identity for linear)
  inv: (v: number) => number, // inverse transform
  isLog = false,
  base = 10
): ContinuousScale {
  const [d0, d1] = d
  const [r0, r1] = r
  const td0 = fwd(d0)
  const td1 = fwd(d1)
  const tspan = td1 - td0 || 1

  const scale = ((v: number) => {
    let t = (fwd(v) - td0) / tspan
    if (clamped) t = Math.max(0, Math.min(1, t))
    return r0 + t * (r1 - r0)
  }) as ContinuousScale

  scale.invert = (px: number) => {
    let t = (px - r0) / (r1 - r0 || 1)
    if (clamped) t = Math.max(0, Math.min(1, t))
    return inv(td0 + t * tspan)
  }
  scale.domain = () => [d0, d1]
  scale.range = () => [r0, r1]

  scale.ticks = (count = 10) => {
    if (isLog) return logTicks(d0, d1, base, count)
    return genTicks(d0, d1, count)
  }
  scale.tickFormat = (count = 10) => {
    if (isLog) return (v: number) => formatNumber(v / base)(v)
    const step = Math.abs(tickStep(d0, d1, count))
    return formatNumber(step)
  }
  scale.nice = (count = 10) => {
    if (isLog) {
      const nd: [number, number] = [
        Math.pow(base, Math.floor(logb(d0, base))),
        Math.pow(base, Math.ceil(logb(d1, base))),
      ]
      return makeLinearish(nd, r, clamped, fwd, inv, true, base)
    }
    return makeLinearish(niceDomain(d0, d1, count), r, clamped, fwd, inv)
  }
  scale.clamp = (on: boolean) => makeLinearish(d, r, on, fwd, inv, isLog, base)
  scale.copy = () => makeLinearish(d, r, clamped, fwd, inv, isLog, base)
  return scale
}

export function scaleLinear(
  domain: [number, number] = [0, 1],
  range: [number, number] = [0, 1]
): ContinuousScale {
  const id = (v: number) => v
  return makeLinearish(domain, range, false, id, id)
}

function logb(v: number, base: number) {
  return Math.log(v) / Math.log(base)
}

export function scaleLog(
  domain: [number, number] = [1, 10],
  range: [number, number] = [0, 1],
  base = 10
): ContinuousScale {
  if (domain[0] <= 0 || domain[1] <= 0) throw new Error('scaleLog domain must be strictly positive')
  return makeLinearish(
    domain,
    range,
    false,
    v => logb(v, base),
    v => Math.pow(base, v),
    true,
    base
  )
}

function logTicks(d0: number, d1: number, base: number, count: number): number[] {
  const lo = Math.floor(logb(d0, base))
  const hi = Math.ceil(logb(d1, base))
  const decades = hi - lo
  const out: number[] = []
  if (decades <= count) {
    // include intermediate values (2×,3×,…) when there's room
    for (let p = lo; p <= hi; p++) {
      const dec = Math.pow(base, p)
      for (let m = 1; m < base; m++) {
        const v = dec * m
        if (v >= d0 - 1e-9 && v <= d1 + 1e-9) out.push(v)
      }
    }
  } else {
    const stride = Math.ceil(decades / count)
    for (let p = lo; p <= hi; p += stride) {
      const v = Math.pow(base, p)
      if (v >= d0 - 1e-9 && v <= d1 + 1e-9) out.push(v)
    }
  }
  return out
}

// ---- time ----
export interface TimeScale extends Omit<
  ContinuousScale,
  'ticks' | 'invert' | 'nice' | 'copy' | 'clamp'
> {
  invert(px: number): number
  ticks(count?: number): number[]
  tickFormat(count?: number): (t: number) => string
  nice(count?: number): TimeScale
  clamp(on: boolean): TimeScale
  copy(): TimeScale
}

/** Time scale. Domain in epoch ms (Date inputs accepted via +date). */
export function scaleTime(
  domain: [number, number] = [0, 1],
  range: [number, number] = [0, 1]
): TimeScale {
  const base = makeLinearish(
    domain,
    range,
    false,
    v => v,
    v => v
  ) as unknown as TimeScale
  const [t0, t1] = domain
  base.ticks = (count = 8) => timeTicks(t0, t1, count)
  base.tickFormat = () => formatTime(Math.abs(t1 - t0))
  base.nice = (count = 8) => {
    const tk = timeTicks(t0, t1, count)
    const lo = tk.length ? Math.min(t0, tk[0]) : t0
    const hi = tk.length ? Math.max(t1, tk[tk.length - 1]) : t1
    return scaleTime([lo, hi], range)
  }
  base.copy = () => scaleTime(domain, range)
  return base
}

// ---- band (categorical, for bars) ----
export interface BandScale {
  (v: string | number): number | undefined
  domain(): Array<string | number>
  range(): [number, number]
  bandwidth(): number
  step(): number
  paddingInner(p: number): BandScale
  paddingOuter(p: number): BandScale
  align(a: number): BandScale
  copy(): BandScale
}

interface BandCfg {
  domain: Array<string | number>
  range: [number, number]
  paddingInner: number
  paddingOuter: number
  align: number
}

function makeBand(cfg: BandCfg): BandScale {
  const { domain, range, paddingInner, paddingOuter, align } = cfg
  const [r0, r1] = range
  const n = domain.length
  const reverse = r1 < r0
  const start = reverse ? r1 : r0
  const stop = reverse ? r0 : r1
  const totalSpan = stop - start
  const step = totalSpan / Math.max(1, n - paddingInner + paddingOuter * 2)
  const bw = step * (1 - paddingInner)
  const offset = start + (totalSpan - step * (n - paddingInner)) * align
  const index = new Map<string | number, number>()
  domain.forEach((dd, i) => index.set(dd, i))

  const scale = ((v: string | number) => {
    const i = index.get(v)
    if (i === undefined) return undefined
    const pos = offset + step * i
    return reverse ? stop - (pos - start) - bw : pos
  }) as BandScale

  scale.domain = () => domain.slice()
  scale.range = () => range
  scale.bandwidth = () => bw
  scale.step = () => step
  scale.paddingInner = p => makeBand({ ...cfg, paddingInner: p })
  scale.paddingOuter = p => makeBand({ ...cfg, paddingOuter: p })
  scale.align = a => makeBand({ ...cfg, align: a })
  scale.copy = () => makeBand({ ...cfg })
  return scale
}

export function scaleBand(
  domain: Array<string | number> = [],
  range: [number, number] = [0, 1]
): BandScale {
  return makeBand({ domain, range, paddingInner: 0.1, paddingOuter: 0.1, align: 0.5 })
}

/** Point scale = band with zero bandwidth (line/scatter categorical x). */
export function scalePoint(
  domain: Array<string | number> = [],
  range: [number, number] = [0, 1]
): BandScale {
  return makeBand({ domain, range, paddingInner: 1, paddingOuter: 0.5, align: 0.5 })
}
