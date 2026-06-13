/**
 * Axis helper — turn a scale into renderable ticks {value, position, label}.
 * Backend-agnostic: you draw the lines/labels however you like.
 */
import type { ContinuousScale, TimeScale, BandScale } from './scale'
import type { Tick } from './types'

export function axisTicks(scale: ContinuousScale | TimeScale, count = 8): Tick[] {
  const values = scale.ticks(count)
  const fmt = scale.tickFormat(count)
  return values.map(value => ({
    value,
    position: (scale as ContinuousScale)(value),
    label: fmt(value),
  }))
}

/** Ticks for a band scale — one per category, centred in its band. */
export function bandAxisTicks(scale: BandScale): Tick[] {
  const bw = scale.bandwidth()
  return scale.domain().map(d => {
    const p = scale(d)
    return { value: typeof d === 'number' ? d : NaN, position: (p ?? 0) + bw / 2, label: String(d) }
  })
}
