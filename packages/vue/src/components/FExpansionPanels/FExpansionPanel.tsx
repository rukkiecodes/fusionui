import { computed, h, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { getUid } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'
import { makeGroupItemProps, useGroupItem } from '../../composables/group'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'
import { FExpansionPanelsContextSymbol, FExpansionPanelsSymbol } from './key'

export const makeFExpansionPanelProps = propsFactory(
  {
    /** Header text. Use the `title` slot for anything richer. */
    title: String as PropType<string>,
    /** Body text. Use the default slot for anything richer. */
    text: String as PropType<string>,
    /** Shown on the right of the header; rotates when the panel opens. */
    expandIcon: { type: [String, Object, Function] as PropType<IconValue>, default: '$dropdown' },
    /** Renders the state but ignores clicks. */
    readonly: Boolean,
    ...makeGroupItemProps(),
    ...makeComponentProps(),
  },
  'FExpansionPanel'
)

/**
 * One panel of an `FExpansionPanels` accordion: a header button that toggles a
 * region of content. The content stays in the DOM (so it can animate) but is
 * made inert while collapsed, keeping it out of the tab order and the
 * accessibility tree.
 */
export const FExpansionPanel = genericComponent()({
  name: 'FExpansionPanel',
  props: makeFExpansionPanelProps(),
  setup(props: any, { slots }: any) {
    const group = useGroupItem(props, FExpansionPanelsSymbol)
    const panels = inject(FExpansionPanelsContextSymbol, null)
    const header = ref<HTMLElement | null>(null)

    const uid = getUid()
    const headerId = `fui-expansion-panel-header-${uid}`
    const contentId = `fui-expansion-panel-content-${uid}`

    // Stand-alone (no accordion parent) the panel keeps its own open state.
    const localOpen = ref(false)
    const isOpen = computed(() => (group ? group.isSelected.value : localOpen.value))

    const isDisabled = computed(() => !!(props.disabled || panels?.disabled.value))
    const isReadonly = computed(() => !!(props.readonly || panels?.readonly.value))

    onMounted(() => {
      if (group && header.value) panels?.registerHeader(group.id, header.value)
    })
    onBeforeUnmount(() => {
      if (group) panels?.unregisterHeader(group.id)
    })

    function toggle(): void {
      if (isDisabled.value || isReadonly.value) return
      if (!group) {
        localOpen.value = !localOpen.value
        return
      }
      // A `mandatory` accordion refuses to close its last open panel.
      if (isOpen.value && panels && !panels.canDeselect(group.id)) return
      group.toggle()
    }

    useRender(() => {
      const title = slots.title ? slots.title() : props.title
      const content = slots.default ? slots.default() : (slots.text?.() ?? props.text)

      return h(
        'div',
        {
          class: [
            'fui-expansion-panel',
            {
              'fui-expansion-panel--active': isOpen.value,
              'fui-expansion-panel--disabled': isDisabled.value,
              'fui-expansion-panel--readonly': isReadonly.value,
            },
            props.class,
          ],
          style: props.style,
        },
        [
          h(
            'button',
            {
              ref: header,
              id: headerId,
              type: 'button',
              class: 'fui-expansion-panel__title',
              'aria-expanded': isOpen.value,
              'aria-controls': contentId,
              'aria-disabled': isReadonly.value || undefined,
              disabled: isDisabled.value,
              onClick: toggle,
              onKeydown: (e: KeyboardEvent) => group && panels?.onHeaderKeydown(e, group.id),
            },
            [
              h('span', { class: 'fui-expansion-panel__label' }, title),
              h(FIcon, { icon: props.expandIcon, class: 'fui-expansion-panel__icon' }),
            ]
          ),
          h(
            'div',
            {
              id: contentId,
              class: 'fui-expansion-panel__wrapper',
              role: 'region',
              'aria-labelledby': headerId,
              // Collapsed content is still in the DOM for the height animation —
              // `inert` keeps it out of the tab order and the a11y tree.
              inert: isOpen.value ? undefined : '',
            },
            [h('div', { class: 'fui-expansion-panel__text' }, content)]
          ),
        ]
      )
    })
  },
})
