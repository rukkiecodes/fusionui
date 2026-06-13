import { h, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { VdTabsWindowSymbol } from './key'

export const makeVdTabsWindowProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    ...makeComponentProps(),
  },
  'VdTabsWindow'
)

/** Holds the panels for a set of tabs. Bind the same model as `VdTabs`. */
export const VdTabsWindow = genericComponent()({
  name: 'VdTabsWindow',
  props: makeVdTabsWindowProps(),
  setup(props: any, { slots }: any) {
    provide(VdTabsWindowSymbol, { selected: toRef(() => props.modelValue) })
    useRender(() =>
      h('div', { class: ['vd-tabs-window', props.class], style: props.style }, slots.default?.())
    )
  },
})
