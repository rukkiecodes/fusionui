import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeGroupProps, useGroup } from '../../composables/group'
import { FItemGroupSymbol } from './key'

export const makeFItemGroupProps = propsFactory(
  {
    ...makeGroupProps({ selectedClass: 'fui-item--selected' }),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FItemGroup'
)

/**
 * The headless selection group every other FusionUI group is a specialisation of.
 * It owns nothing visual: children opt in through `FItem` and decide for
 * themselves what "selected" looks like.
 */
export const FItemGroup = genericComponent()({
  name: 'FItemGroup',
  props: makeFItemGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { isSelected, select, selected, items } = useGroup(props, FItemGroupSymbol)

    useRender(() =>
      h(
        props.tag,
        {
          class: ['fui-item-group', props.class],
          style: props.style,
          role: 'group',
        },
        slots.default?.({
          isSelected,
          select,
          selected: selected.value,
          items: items.value,
        })
      )
    )
  },
})
