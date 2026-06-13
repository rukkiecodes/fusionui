import { computed, h, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import type { IconValue } from '../../composables/icons'
import { VdIcon } from '../VdIcon'
import { VdTabsSymbol } from './key'

export const makeVdTabProps = propsFactory(
  {
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    text: [String, Number] as PropType<string | number>,
    icon: [String, Object, Function] as PropType<IconValue>,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'VdTab'
)

export const VdTab = genericComponent()({
  name: 'VdTab',
  props: makeVdTabProps(),
  setup(props: any, { slots }: any) {
    const tabs = inject(VdTabsSymbol, null)
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
            'vd-tab',
            { 'vd-tab--active': isActive.value, 'vd-tab--disabled': props.disabled },
            props.class,
          ],
          style: props.style,
          role: 'tab',
          'aria-selected': isActive.value,
          disabled: props.disabled,
          onClick: () => tabs?.select(value.value),
        },
        [
          props.icon ? h(VdIcon, { icon: props.icon, class: 'vd-tab__icon' }) : null,
          slots.default ? slots.default() : props.text,
        ]
      )
    )
  },
})
