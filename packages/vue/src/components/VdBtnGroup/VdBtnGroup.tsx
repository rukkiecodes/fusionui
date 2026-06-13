import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeGroupProps, useGroup } from '../../composables/group'
import { VdBtnGroupSymbol } from './key'

export const makeVdBtnGroupProps = propsFactory(
  {
    divided: Boolean,
    ...makeGroupProps(),
    ...makeRoundedProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdBtnGroup'
)

export const VdBtnGroup = genericComponent()({
  name: 'VdBtnGroup',
  props: makeVdBtnGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { roundedClasses } = useRounded(props)
    useGroup(props, VdBtnGroupSymbol)

    useRender(() =>
      h(
        'div',
        {
          class: [
            'vd-btn-group',
            { 'vd-btn-group--divided': props.divided },
            ...roundedClasses.value,
            props.class,
          ],
          style: props.style,
          role: 'group',
        },
        slots.default?.()
      )
    )
  },
})
