import { h, toRef } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeVariantProps } from '../../composables/variant'
import { makeGroupProps, useGroup } from '../../composables/group'
import { provideDefaults } from '../../composables/defaults'
import { FChipGroupSymbol } from './key'

export const makeFChipGroupProps = propsFactory(
  {
    /** Wrap onto multiple lines instead of scrolling on one. */
    column: Boolean,
    /** Slide a check icon into each chip as it is selected. */
    filter: Boolean,
    ...makeVariantProps({ variant: 'tonal' }),
    ...makeGroupProps({ selectedClass: 'fui-chip--selected' }),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FChipGroup'
)

/**
 * A scrolling rail of selectable `FChip`s — the chip equivalent of `FBtnToggle`.
 * The chips inside stay ordinary chips: they pick the group's `variant`, `color`
 * and `filter` up from the defaults system unless they set their own.
 */
export const FChipGroup = genericComponent()({
  name: 'FChipGroup',
  props: makeFChipGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { isSelected, select, selected } = useGroup(props, FChipGroupSymbol)

    provideDefaults({
      FChip: {
        variant: toRef(() => props.variant),
        color: toRef(() => props.color),
        filter: toRef(() => props.filter),
      },
    })

    useRender(() =>
      h(
        props.tag,
        {
          class: [
            'fui-chip-group',
            {
              'fui-chip-group--column': props.column,
              'fui-chip-group--filter': props.filter,
            },
            props.class,
          ],
          style: props.style,
          role: 'group',
        },
        [
          h(
            'div',
            { class: 'fui-chip-group__content' },
            slots.default?.({ isSelected, select, selected: selected.value })
          ),
        ]
      )
    )
  },
})
