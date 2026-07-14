import { computed, h, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeGroupItemProps, useGroupItem } from '../../composables/group'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'
import { FSlideGroupContextSymbol, FSlideGroupSymbol } from './key'

export const makeFSlideGroupItemProps = propsFactory(
  {
    /** Identifies the item in the group's model. Defaults to its index. */
    text: [String, Number] as PropType<string | number>,
    icon: [String, Object, Function] as PropType<IconValue>,
    ...makeGroupItemProps(),
    ...makeComponentProps(),
  },
  'FSlideGroupItem'
)

/**
 * One selectable item in an `FSlideGroup`. It is a real button, so it focuses,
 * takes the arrow keys and reports its selected state to assistive tech; the
 * default slot receives `{ isSelected, toggle }` if you want to render your own.
 */
export const FSlideGroupItem = genericComponent()({
  name: 'FSlideGroupItem',
  props: makeFSlideGroupItemProps(),
  setup(props: any, { slots }: any) {
    const group = useGroupItem(props, FSlideGroupSymbol)
    const slideGroup = inject(FSlideGroupContextSymbol, null)
    const root = ref<HTMLElement | null>(null)

    const isSelected = computed(() => group?.isSelected.value ?? false)

    onMounted(() => {
      if (group && root.value) slideGroup?.registerEl(group.id, root.value)
    })
    onBeforeUnmount(() => {
      if (group) slideGroup?.unregisterEl(group.id)
    })

    function toggle(): void {
      if (props.disabled || !group) return
      // In a `mandatory` group the last selected item cannot be turned off.
      if (isSelected.value && slideGroup && !slideGroup.canDeselect(group.id)) return
      group.toggle()
    }

    useRender(() =>
      h(
        'button',
        {
          ref: root,
          type: 'button',
          class: [
            'fui-slide-group-item',
            {
              'fui-slide-group-item--active': isSelected.value,
              'fui-slide-group-item--disabled': props.disabled,
            },
            props.class,
          ],
          style: props.style,
          disabled: props.disabled,
          'aria-pressed': isSelected.value,
          onClick: toggle,
          onFocus: () => group && slideGroup?.onItemFocus(group.id),
          onKeydown: (e: KeyboardEvent) => group && slideGroup?.onItemKeydown(e, group.id),
        },
        [
          props.icon
            ? h(FIcon, { icon: props.icon, class: 'fui-slide-group-item__icon', size: 'small' })
            : null,
          slots.default
            ? slots.default({ isSelected: isSelected.value, toggle })
            : (props.text ?? null),
        ]
      )
    )
  },
})
