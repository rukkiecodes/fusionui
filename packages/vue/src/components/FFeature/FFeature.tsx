import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFFeatureProps = propsFactory(
  {
    icon: [String, Object, Function] as PropType<IconValue>,
    title: String as PropType<string>,
    text: String as PropType<string>,
    /** Lift slightly on hover (good for clickable feature grids). */
    hover: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FFeature'
)

/**
 * An icon-led feature card — an icon badge, a title and supporting text.
 * Used for feature grids, "how it works" steps and value props.
 */
export const FFeature = genericComponent()({
  name: 'FFeature',
  props: makeFFeatureProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-feature', { 'fui-feature--hover': props.hover }, props.class],
          style: props.style,
        },
        [
          props.icon || slots.icon
            ? h('span', { class: 'fui-feature__icon' }, [
                slots.icon ? slots.icon() : h(FIcon, { icon: props.icon }),
              ])
            : null,
          h('h3', { class: 'fui-feature__title' }, slots.title ? slots.title() : props.title),
          h('p', { class: 'fui-feature__text' }, slots.default ? slots.default() : props.text),
        ]
      )
    )
  },
})
