import { computed, h, inject } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { VdTabsSymbol, VdTabsWindowSymbol } from './key'

export const makeVdTabPanelProps = propsFactory(
  {
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    ...makeComponentProps(),
  },
  'VdTabPanel'
)

export const VdTabPanel = genericComponent()({
  name: 'VdTabPanel',
  props: makeVdTabPanelProps(),
  setup(props: any, { slots }: any) {
    // Prefer the surrounding window (sibling-of-tabs pattern); fall back to the
    // tabs context when a panel is nested directly under VdTabs.
    const window = inject(VdTabsWindowSymbol, null)
    const tabs = inject(VdTabsSymbol, null)
    const isActive = computed(() => (window ?? tabs)?.selected.value === props.value)

    useRender(() =>
      isActive.value
        ? h(
            'div',
            { class: ['vd-tab-panel', props.class], style: props.style, role: 'tabpanel' },
            slots.default?.()
          )
        : null
    )
  },
})
