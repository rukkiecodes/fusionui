import { computed, h, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'
import { FTabsSymbol } from './key'

export const makeVdTabProps = propsFactory(
  {
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    text: [String, Number] as PropType<string | number>,
    icon: [String, Object, Function] as PropType<IconValue>,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'FTab'
)

export const FTab = genericComponent()({
  name: 'FTab',
  props: makeVdTabProps(),
  setup(props: any, { slots }: any) {
    const tabs = inject(FTabsSymbol, null)
    const root = ref<HTMLElement | null>(null)
    const value = computed(() => props.value ?? props.text)
    const isActive = computed(() => tabs?.selected.value === value.value)

    onMounted(() => {
      if (tabs && root.value) tabs.register(value.value, root.value)
    })
    onBeforeUnmount(() => tabs?.unregister(value.value))

    useRender(() =>
      h(
        'button',
        {
          ref: root,
          class: [
            'fui-tab',
            { 'fui-tab--active': isActive.value, 'fui-tab--disabled': props.disabled },
            props.class,
          ],
          style: props.style,
          role: 'tab',
          'aria-selected': isActive.value,
          disabled: props.disabled,
          onClick: () => tabs?.select(value.value),
        },
        [
          props.icon ? h(FIcon, { icon: props.icon, class: 'fui-tab__icon' }) : null,
          slots.default ? slots.default() : props.text,
        ]
      )
    )
  },
})
