import { computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { FTabsSymbol, FTabsWindowSymbol } from './key'

export const makeFTabPanelProps = propsFactory(
  {
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    ...makeComponentProps(),
  },
  'FTabPanel'
)

export const FTabPanel = genericComponent()({
  name: 'FTabPanel',
  props: makeFTabPanelProps(),
  setup(props: any, { slots }: any) {
    // Prefer the surrounding window (sibling-of-tabs pattern); fall back to the
    // tabs context when a panel is nested directly under FTabs.
    const window = inject(FTabsWindowSymbol, null)
    const tabs = inject(FTabsSymbol, null)
    const isActive = computed(() => (window ?? tabs)?.selected.value === props.value)

    useRender(() =>
      isActive.value
        ? h(
            'div',
            { class: ['fui-tab-panel', props.class], style: props.style, role: 'tabpanel' },
            slots.default?.()
          )
        : null
    )
  },
})
