import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { createLayout } from '../../composables/layout'

export const makeFLayoutProps = propsFactory(
  {
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FLayout'
)

/**
 * The layout root. Provides the layout context so child `<f-navbar>` /
 * `<f-sidebar>` register their size + position and `<f-main>` insets itself.
 */
export const FLayout = genericComponent()({
  name: 'FLayout',
  props: makeFLayoutProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    createLayout()

    useRender(() =>
      h(
        'div',
        { class: ['fui-layout', props.class], style: props.style },
        slots.default ? slots.default() : undefined
      )
    )
  },
})
