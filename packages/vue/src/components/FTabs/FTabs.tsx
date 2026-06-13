import { h, nextTick, provide, reactive, ref, toRef, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FTabsSymbol } from './key'

export const makeFTabsProps = propsFactory(
  {
    modelValue: { type: null as unknown as PropType<unknown>, default: undefined },
    color: { type: String as PropType<string>, default: 'primary' },
    grow: Boolean,
    align: {
      type: String as PropType<'start' | 'center' | 'end'>,
      default: 'start',
    },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FTabs'
)

export const FTabs = genericComponent()({
  name: 'FTabs',
  props: makeFTabsProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const model = useProxiedModel(props, 'modelValue', undefined)
    const els = reactive(new Map<unknown, HTMLElement>())
    const indicator = ref<{ left: string; width: string }>({ left: '0px', width: '0px' })

    function updateIndicator(): void {
      const el = els.get(model.value)
      if (el) indicator.value = { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` }
      else indicator.value = { left: '0px', width: '0px' }
    }

    provide(FTabsSymbol, {
      selected: toRef(() => model.value),
      color: toRef(() => props.color),
      select: (value: unknown) => {
        model.value = value
      },
      register: (value: unknown, el: HTMLElement) => {
        els.set(value, el)
        if (model.value === undefined) model.value = value
        nextTick(updateIndicator)
      },
      unregister: (value: unknown) => {
        els.delete(value)
      },
    })

    watch(model, () => nextTick(updateIndicator))

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-tabs',
            `fui-tabs--align-${props.align}`,
            { 'fui-tabs--grow': props.grow },
            props.class,
          ],
          style: [{ '--fui-tabs-color': `var(--fui-theme-${props.color})` }, props.style],
          role: 'tablist',
        },
        [
          slots.default?.(),
          h('div', {
            class: 'fui-tabs__indicator',
            style: { left: indicator.value.left, width: indicator.value.width },
          }),
        ]
      )
    )
  },
})
