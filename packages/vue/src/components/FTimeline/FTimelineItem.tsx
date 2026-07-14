import { computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { useColor } from '../../composables/color'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'
import { FTimelineSymbol } from './key'
import type { TimelineItemSide } from './key'

/** Named dot sizes. Anything else is treated as a CSS length. */
const dotSizes: Record<string, string> = {
  'x-small': '20px',
  small: '28px',
  default: '38px',
  medium: '44px',
  large: '52px',
  'x-large': '64px',
}

export const makeFTimelineItemProps = propsFactory(
  {
    /** Icon rendered inside the dot. */
    icon: [String, Object, Function, Array] as PropType<IconValue>,
    /** Dot color — a theme name or any CSS color. Falls back to the timeline's `dot-color`. */
    dotColor: String as PropType<string>,
    /** Color of the dot's icon. Falls back to the timeline's `icon-color`. */
    iconColor: String as PropType<string>,
    /** Dot size (`x-small` … `x-large`, or a number of px). Falls back to the timeline's `size`. */
    size: [String, Number] as PropType<string | number>,
    /** Fill the dot with its color instead of drawing it as a ring on the surface. */
    fillDot: { type: Boolean, default: undefined },
    /** Drop the dot entirely — the line runs straight through. */
    hideDot: Boolean,
    /** Never render this item's `opposite` slot. */
    hideOpposite: { type: Boolean, default: undefined },
    /** Pin this item to one side of the line, overriding the timeline's `side`. */
    side: {
      type: String as PropType<TimelineItemSide>,
      validator: (v: unknown) => v == null || ['start', 'end'].includes(v as string),
    },
    ...makeElevationProps(),
    ...makeTagProps(),
    ...makeComponentProps(),
  },
  'FTimelineItem'
)

/** One entry on an `FTimeline`: a dot on the line, a body, and an optional opposite. */
export const FTimelineItem = genericComponent()({
  name: 'FTimelineItem',
  props: makeFTimelineItemProps(),
  setup(props: any, { slots }: any) {
    const timeline = inject(FTimelineSymbol, null)
    const { elevationClasses } = useElevation(props)

    const dotColor = computed(() => props.dotColor ?? timeline?.dotColor.value ?? 'primary')
    const iconColor = computed(() => props.iconColor ?? timeline?.iconColor.value)
    const size = computed(() => props.size ?? timeline?.size.value ?? 'default')
    const fillDot = computed(() => props.fillDot ?? timeline?.fillDot.value ?? false)

    // A filled dot takes the colour as its background; the default ring takes it as
    // its text colour, so the stylesheet can draw the ring with `currentColor`.
    const { colorClasses: dotClasses, colorStyles: dotStyles } = useColor(() =>
      fillDot.value ? { background: dotColor.value } : { text: dotColor.value }
    )

    // `default` leaves the dot sized by the timeline's density; anything else pins it.
    const dotSize = computed(() => {
      const value = size.value
      if (value == null || value === 'default') return undefined
      return dotSizes[String(value)] ?? convertToUnit(value)
    })

    const showOpposite = computed(() => {
      if (!slots.opposite) return false
      if (props.hideOpposite ?? timeline?.hideOpposite.value) return false
      // A compact timeline has no opposite track to render into.
      return timeline?.density.value !== 'compact'
    })

    useRender(() =>
      h(
        props.tag,
        {
          class: [
            'fui-timeline-item',
            {
              'fui-timeline-item--fill-dot': fillDot.value,
              'fui-timeline-item--hide-dot': props.hideDot,
              'fui-timeline-item--side-start': props.side === 'start',
              'fui-timeline-item--side-end': props.side === 'end',
            },
            props.class,
          ],
          style: [{ '--fui-timeline-dot-size': dotSize.value }, props.style],
          role: 'listitem',
        },
        [
          showOpposite.value
            ? h('div', { class: 'fui-timeline-item__opposite' }, slots.opposite())
            : null,
          h('div', { class: 'fui-timeline-item__divider' }, [
            h('div', { class: 'fui-timeline-item__line fui-timeline-item__line--before' }),
            props.hideDot
              ? null
              : h('div', { class: ['fui-timeline-item__dot', ...elevationClasses.value] }, [
                  h(
                    'div',
                    {
                      class: ['fui-timeline-item__dot-inner', ...dotClasses.value],
                      style: dotStyles.value,
                    },
                    [
                      slots.icon
                        ? slots.icon()
                        : props.icon
                          ? h(FIcon, { icon: props.icon, color: iconColor.value })
                          : null,
                    ]
                  ),
                ]),
            h('div', { class: 'fui-timeline-item__line fui-timeline-item__line--after' }),
          ]),
          h('div', { class: 'fui-timeline-item__body' }, slots.default?.()),
        ]
      )
    )
  },
})
