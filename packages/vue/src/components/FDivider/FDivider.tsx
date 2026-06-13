import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeVdDividerProps = propsFactory(
  {
    vertical: Boolean,
    inset: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FDivider'
)

export const FDivider = genericComponent()({
  name: 'FDivider',
  props: makeVdDividerProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    useRender(() =>
      h(
        'hr',
        {
          class: [
            'fui-divider',
            {
              'fui-divider--vertical': props.vertical,
              'fui-divider--inset': props.inset,
            },
            props.class,
          ],
          style: props.style,
          role: 'separator',
          'aria-orientation': props.vertical ? 'vertical' : 'horizontal',
        },
        slots.default?.()
      )
    )
  },
})
