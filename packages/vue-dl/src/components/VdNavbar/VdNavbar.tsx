import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useColor } from '../../composables/color'

export const makeVdNavbarProps = propsFactory(
  {
    color: String as PropType<string>,
    flat: Boolean,
    fixed: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdNavbar'
)

export const VdNavbar = genericComponent()({
  name: 'VdNavbar',
  props: makeVdNavbarProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { colorClasses, colorStyles } = useColor(() => ({ background: props.color }))

    useRender(() =>
      h(
        'header',
        {
          class: [
            'vd-navbar',
            { 'vd-navbar--flat': props.flat, 'vd-navbar--fixed': props.fixed },
            ...colorClasses.value,
            props.class,
          ],
          style: [colorStyles.value, props.style],
        },
        [
          slots.brand ? h('div', { class: 'vd-navbar__brand' }, slots.brand()) : null,
          h('div', { class: 'vd-navbar__content' }, slots.default?.()),
          slots.append ? h('div', { class: 'vd-navbar__append' }, slots.append()) : null,
        ]
      )
    )
  },
})
