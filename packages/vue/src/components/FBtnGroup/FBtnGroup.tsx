import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeGroupProps, useGroup } from '../../composables/group'
import { FBtnGroupSymbol } from './key'

export const makeFBtnGroupProps = propsFactory(
  {
    divided: Boolean,
    ...makeGroupProps(),
    ...makeRoundedProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FBtnGroup'
)

export const FBtnGroup = genericComponent()({
  name: 'FBtnGroup',
  props: makeFBtnGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { roundedClasses } = useRounded(props)
    useGroup(props, FBtnGroupSymbol)

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-btn-group',
            { 'fui-btn-group--divided': props.divided },
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
