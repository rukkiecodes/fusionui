import { h, provide, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { FTabsWindowSymbol } from './key'

export const makeFTabsWindowProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    ...makeComponentProps(),
  },
  'FTabsWindow'
)

/** Holds the panels for a set of tabs. Bind the same model as `FTabs`. */
export const FTabsWindow = genericComponent()({
  name: 'FTabsWindow',
  props: makeFTabsWindowProps(),
  setup(props: any, { slots }: any) {
    provide(FTabsWindowSymbol, { selected: toRef(() => props.modelValue) })
    useRender(() =>
      h('div', { class: ['fui-tabs-window', props.class], style: props.style }, slots.default?.())
    )
  },
})
