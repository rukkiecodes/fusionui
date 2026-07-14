import { computed, h, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeDensityProps, useDensity } from '../../composables/density'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { FTimelineSymbol, resolveTimelineColor } from './key'
import type { TimelineDirection, TimelineSide, TimelineTruncateLine } from './key'

export const makeFTimelineProps = propsFactory(
  {
    /** Run the timeline down the page (`vertical`) or across it (`horizontal`). */
    direction: {
      type: String as PropType<TimelineDirection>,
      default: 'vertical',
      validator: (v: unknown) => ['vertical', 'horizontal'].includes(v as string),
    },
    /** Which side of the line the items sit on. Defaults to `alternate` (`end` at any non-default density). */
    side: {
      type: String as PropType<TimelineSide>,
      validator: (v: unknown) => v == null || ['start', 'end', 'alternate'].includes(v as string),
    },
    /** Thickness of the connecting line, in px or any CSS length. */
    lineThickness: { type: [String, Number] as PropType<string | number>, default: 2 },
    /** Color of the connecting line — a theme name or any CSS color. */
    lineColor: String as PropType<string>,
    /** Clip the line before the first dot, after the last dot, or `both`. */
    truncateLine: {
      type: String as PropType<TimelineTruncateLine>,
      validator: (v: unknown) => v == null || ['start', 'end', 'both'].includes(v as string),
    },
    /** Default dot color for every item — a theme name or any CSS color. */
    dotColor: { type: String as PropType<string>, default: 'primary' },
    /** Default icon color for every item's dot. */
    iconColor: String as PropType<string>,
    /** Default dot size for every item (`x-small` … `x-large`, or a number of px). */
    size: { type: [String, Number] as PropType<string | number>, default: 'default' },
    /** Fill the dot with its color instead of drawing it as a ring on the surface. */
    fillDot: Boolean,
    /** Never render the `opposite` slot. */
    hideOpposite: Boolean,
    ...makeDensityProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTimeline'
)

/**
 * A vertical or horizontal timeline. Items alternate around a connecting line by
 * default; `side` pins them all to one side, and each `FTimelineItem` can opt out.
 */
export const FTimeline = genericComponent()({
  name: 'FTimeline',
  props: makeFTimelineProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { densityClasses } = useDensity(props)

    // A compact/comfortable timeline has no room to alternate — it stacks to one side.
    const side = computed<TimelineSide>(
      () => props.side ?? (props.density !== 'default' ? 'end' : 'alternate')
    )

    const truncateClasses = computed(() => {
      const start = 'fui-timeline--truncate-line-start'
      const end = 'fui-timeline--truncate-line-end'
      switch (props.truncateLine) {
        case 'both':
          return [start, end]
        case 'start':
          return [start]
        case 'end':
          return [end]
        default:
          return []
      }
    })

    provide(FTimelineSymbol, {
      direction: toRef(() => props.direction),
      density: toRef(() => props.density),
      dotColor: toRef(() => props.dotColor),
      iconColor: toRef(() => props.iconColor),
      size: toRef(() => props.size),
      fillDot: toRef(() => props.fillDot),
      hideOpposite: toRef(() => props.hideOpposite),
    })

    useRender(() =>
      h(
        props.tag,
        {
          class: [
            'fui-timeline',
            `fui-timeline--${props.direction}`,
            `fui-timeline--side-${side.value}`,
            ...truncateClasses.value,
            ...densityClasses.value,
            props.class,
          ],
          style: [
            {
              '--fui-timeline-line-thickness': convertToUnit(props.lineThickness),
              '--fui-timeline-line-color': resolveTimelineColor(props.lineColor),
            },
            props.style,
          ],
          role: 'list',
        },
        slots.default?.()
      )
    )
  },
})
