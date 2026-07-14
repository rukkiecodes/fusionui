import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeGroupItemProps, useGroupItem } from '../../composables/group'
import { FItemGroupSymbol } from './key'

export const makeFItemProps = propsFactory(
  {
    ...makeGroupItemProps(),
  },
  'FItem'
)

/**
 * Renderless member of an `FItemGroup`: it renders whatever its default slot
 * returns and hands it the selection state (`isSelected`, `toggle`, `select`,
 * `selectedClass`).
 */
export const FItem = genericComponent()({
  name: 'FItem',
  props: makeFItemProps(),
  setup(props: any, { slots }: any) {
    const group = useGroupItem(props, FItemGroupSymbol)

    useRender(
      () =>
        slots.default?.({
          isSelected: group?.isSelected.value ?? false,
          selectedClass: group?.selectedClass.value ?? [],
          toggle: () => group?.toggle(),
          select: (value: boolean) => group?.select(value),
          value: props.value,
          disabled: props.disabled,
        }) ?? null
    )
  },
})
