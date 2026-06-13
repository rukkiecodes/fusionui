/**
 * Nice numbers and ticks — the part everyone gets subtly wrong.
 *
 * Humans read axes labelled 0, 20, 40, 60 — never 0, 17.3, 34.6. The 1-2-5
 * algorithm picks a step that's a power of ten times 1, 2, or 5, closest to
 * the ideal spacing for the requested tick count. `nice()` then rounds the
 * domain outward to step boundaries so the axis starts and ends on round
 * numbers. This is the d3 algorithm, reimplemented and verified.
 */

const e10 = Math.sqrt(50)
const e5 = Math.sqrt(10)
const e2 = Math.sqrt(2)

/** The "nice" step between `count` ticks across [start, stop]. Signed. */
export function tickStep(start: number, stop: number, count: number): number {
  const step0 = Math.abs(stop - start) / Math.max(0, count)
  let step1 = Math.pow(10, Math.floor(Math.log10(step0)))
  const error = step0 / step1
  if (error >= e10) step1 *= 10
  else if (error >= e5) step1 *= 5
  else if (error >= e2) step1 *= 2
  return stop < start ? -step1 : step1
}

/** Tick values across [start, stop], aligned to nice step boundaries. */
export function ticks(start: number, stop: number, count: number): number[] {
  if (start === stop) return [start]
  const step = tickStep(start, stop, count)
  if (!Number.isFinite(step) || step === 0) return []
  const out: number[] = []
  if (step > 0) {
    let i = Math.ceil(start / step)
    const end = Math.floor(stop / step)
    for (; i <= end; i++) out.push(i * step)
  } else {
    let i = Math.ceil(start * -step) // step is negative; mirror logic
    const end = Math.floor(stop * -step)
    for (; i <= end; i++) out.push(i / -step)
  }
  return out
}

/** Round a [d0, d1] domain outward to nice step boundaries. */
export function niceDomain(d0: number, d1: number, count: number): [number, number] {
  if (d0 === d1) return [d0, d1]
  let lo = d0
  let hi = d1
  const reverse = d1 < d0
  if (reverse) {
    lo = d1
    hi = d0
  }
  let prev = Infinity
  // iterate until the step stabilises (handles the rare two-pass case)
  for (let k = 0; k < 8; k++) {
    const step = tickStep(lo, hi, count)
    if (step === prev || !Number.isFinite(step)) break
    prev = step
    lo = Math.floor(lo / step) * step
    hi = Math.ceil(hi / step) * step
  }
  return reverse ? [hi, lo] : [lo, hi]
}

/** Decimal places needed so consecutive ticks are distinguishable. */
function precisionFor(step: number): number {
  if (!Number.isFinite(step) || step === 0) return 0
  const p = -Math.floor(Math.log10(Math.abs(step)))
  return p > 0 ? p : 0
}

/** A compact default number formatter, k/M/B for large magnitudes. */
export function formatNumber(step = 1): (v: number) => string {
  const prec = precisionFor(step)
  return (v: number) => {
    const a = Math.abs(v)
    if (a >= 1e9) return trimUnit(v / 1e9) + 'B'
    if (a >= 1e6) return trimUnit(v / 1e6) + 'M'
    if (a >= 1e3 && prec === 0) return trimUnit(v / 1e3) + 'k'
    return v.toFixed(prec)
  }
}
function trimUnit(v: number): string {
  return (Math.round(v * 10) / 10).toString()
}

// ---- time ticks ----
const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30
const YEAR = DAY * 365

const TIME_STEPS: Array<[number, number]> = [
  [SECOND, 1],
  [SECOND, 5],
  [SECOND, 15],
  [SECOND, 30],
  [MINUTE, 1],
  [MINUTE, 5],
  [MINUTE, 15],
  [MINUTE, 30],
  [HOUR, 1],
  [HOUR, 3],
  [HOUR, 6],
  [HOUR, 12],
  [DAY, 1],
  [DAY, 2],
  [WEEK, 1],
  [MONTH, 1],
  [MONTH, 3],
  [YEAR, 1],
]

/** Tick timestamps (ms) across [t0, t1] at a nice calendar-ish interval. */
export function timeTicks(t0: number, t1: number, count: number): number[] {
  const span = Math.abs(t1 - t0)
  const target = span / Math.max(1, count)
  let chosen = TIME_STEPS[TIME_STEPS.length - 1]
  for (const s of TIME_STEPS) {
    if (s[0] * s[1] >= target) {
      chosen = s
      break
    }
  }
  const [unit, mult] = chosen
  const out: number[] = []
  if (unit === MONTH || unit === YEAR) {
    // step by calendar months/years for correctness
    const stepMonths = unit === YEAR ? 12 * mult : mult
    const d = new Date(t0)
    d.setUTCDate(1)
    d.setUTCHours(0, 0, 0, 0)
    // align to the month grid
    const m0 = d.getUTCFullYear() * 12 + d.getUTCMonth()
    let m = Math.ceil(m0 / stepMonths) * stepMonths
    for (let guard = 0; guard < 1000; guard++) {
      const year = Math.floor(m / 12)
      const month = m - year * 12
      const t = Date.UTC(year, month, 1)
      if (t > t1) break
      if (t >= t0) out.push(t)
      m += stepMonths
    }
  } else {
    const step = unit * mult
    let t = Math.ceil(t0 / step) * step
    for (; t <= t1; t += step) out.push(t)
  }
  return out
}

/** Pick a time format appropriate to the tick span. */
export function formatTime(spanMs: number): (t: number) => string {
  const d2 = (n: number) => String(n).padStart(2, '0')
  return (t: number) => {
    const d = new Date(t)
    if (spanMs < MINUTE) return `${d2(d.getUTCMinutes())}:${d2(d.getUTCSeconds())}`
    if (spanMs < DAY) return `${d2(d.getUTCHours())}:${d2(d.getUTCMinutes())}`
    if (spanMs < YEAR) return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
  }
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
