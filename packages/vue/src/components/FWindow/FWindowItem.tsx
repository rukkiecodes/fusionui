import { Transition, computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useGroupItem } from '../../composables/group'
import { FWindowContextSymbol, FWindowSymbol } from './key'

export const makeFWindowItemProps = propsFactory(
  {
    /** Identifies the item in the window's model. Defaults to its index. */
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'FWindowItem'
)

/**
 * A single pane of an `FWindow`. Only the active item is mounted; the outgoing
 * one is kept around for the length of the transition and positioned absolutely
 * so it does not push the container around.
 */
export const FWindowItem = genericComponent()({
  name: 'FWindowItem',
  props: makeFWindowItemProps(),
  setup(props: any, { slots }: any) {
    const group = useGroupItem(props, FWindowSymbol)
    const window = inject(FWindowContextSymbol, null)
    // Used stand-alone (no window parent), an item simply renders its content.
    const isActive = computed(() => (group ? group.isSelected.value : true))

    useRender(() =>
      h(
        Transition,
        { name: window?.transition.value },
        {
          default: () =>
            isActive.value
              ? h(
                  'div',
                  { class: ['fui-window-item', props.class], style: props.style },
                  slots.default?.()
                )
              : null,
        }
      )
    )
  },
})
