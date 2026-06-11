import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'

export const makeVdBadgeProps = propsFactory(
  {
    content: [String, Number] as PropType<string | number>,
    color: { type: String as PropType<string>, default: 'danger' },
    dot: Boolean,
    inline: Boolean,
    modelValue: { type: Boolean, default: true },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdBadge'
)

export const VdBadge = genericComponent()({
  name: 'VdBadge',
  props: makeVdBadgeProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { colorClasses, colorStyles } = useColor(() => ({ background: props.color }))

    useRender(() => {
      const badge = props.modelValue
        ? h(
            'span',
            {
              class: [
                'vd-badge__badge',
                { 'vd-badge__badge--dot': props.dot },
                ...colorClasses.value,
              ],
              style: colorStyles.value,
            },
            props.dot ? undefined : slots.badge ? slots.badge() : props.content
          )
        : null

      return h(
        'span',
        {
          class: ['vd-badge', { 'vd-badge--inline': props.inline }, props.class],
          style: props.style,
        },
        [slots.default?.(), badge]
      )
    })
  },
})
