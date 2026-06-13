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
  'VdDivider'
)

export const VdDivider = genericComponent()({
  name: 'VdDivider',
  props: makeVdDividerProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    useRender(() =>
      h(
        'hr',
        {
          class: [
            'vd-divider',
            {
              'vd-divider--vertical': props.vertical,
              'vd-divider--inset': props.inset,
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
