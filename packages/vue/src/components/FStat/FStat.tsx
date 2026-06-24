import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFStatProps = propsFactory(
  {
    value: [String, Number] as PropType<string | number>,
    label: String as PropType<string>,
    icon: [String, Object, Function] as PropType<IconValue>,
    color: { type: String as PropType<string>, default: 'primary' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FStat'
)

/**
 * A labelled statistic — a big value over a caption, with an optional leading
 * icon. Handy for trust strips, dashboards and profile headers.
 */
export const FStat = genericComponent()({
  name: 'FStat',
  props: makeFStatProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const accent = computed(() =>
      props.color && !props.color.startsWith('#')
        ? `rgb(var(--fui-theme-${props.color}))`
        : props.color
    )

    useRender(() =>
      h('div', { class: ['fui-stat', props.class], style: props.style }, [
        props.icon
          ? h('span', { class: 'fui-stat__icon' }, [h(FIcon, { icon: props.icon })])
          : null,
        h('div', { class: 'fui-stat__body' }, [
          h(
            'div',
            { class: 'fui-stat__value', style: { color: accent.value } },
            slots.default ? slots.default() : String(props.value ?? '')
          ),
          h('div', { class: 'fui-stat__label' }, slots.label ? slots.label() : props.label),
        ]),
      ])
    )
  },
})
