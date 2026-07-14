import type { InjectionKey, Ref } from 'vue'
import type { Density } from '../../composables/density'

export type TimelineDirection = 'vertical' | 'horizontal'
export type TimelineSide = 'start' | 'end' | 'alternate'
export type TimelineItemSide = 'start' | 'end'
export type TimelineTruncateLine = 'start' | 'end' | 'both'

/** Timeline-level defaults every FTimelineItem inherits (and may override). */
export interface TimelineProvide {
  direction: Ref<TimelineDirection>
  density: Ref<Density>
  dotColor: Ref<string | undefined>
  iconColor: Ref<string | undefined>
  size: Ref<string | number | undefined>
  fillDot: Ref<boolean>
  hideOpposite: Ref<boolean>
}

export const FTimelineSymbol: InjectionKey<TimelineProvide> = Symbol.for('fusionui:timeline')

/** Resolves a theme color name to its RGB var, and passes CSS colors through. */
export function resolveTimelineColor(value?: string): string | undefined {
  if (!value) return undefined
  return /^(#|rgb|hsl|var\()/.test(value) ? value : `rgb(var(--fui-theme-${value}))`
}
