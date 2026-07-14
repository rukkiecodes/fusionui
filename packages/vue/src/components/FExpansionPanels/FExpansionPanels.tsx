import { h, provide, toRef, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeGroupProps, useGroup } from '../../composables/group'
import { FExpansionPanelsContextSymbol, FExpansionPanelsSymbol } from './key'
import type { ExpansionPanelsVariant } from './key'

const VARIANTS: ExpansionPanelsVariant[] = ['default', 'accordion', 'inset', 'popout']

export const makeFExpansionPanelsProps = propsFactory(
  {
    /** `default` · `accordion` (flush) · `inset` (open panel steps in) · `popout` (open panel steps out). */
    variant: {
      type: String as PropType<ExpansionPanelsVariant>,
      default: 'default',
      validator: (v: unknown) => VARIANTS.includes(v as ExpansionPanelsVariant),
    },
    /** Panels render their state but cannot be toggled. */
    readonly: Boolean,
    /** Dims and blocks every panel. */
    disabled: Boolean,
    ...makeGroupProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FExpansionPanels'
)

/**
 * The accordion: a stack of `FExpansionPanel`s that share one selection model.
 * One panel is open at a time unless `multiple` is set; `mandatory` keeps at
 * least one open. For a single, standalone disclosure, use `FCollapse` instead.
 */
export const FExpansionPanels = genericComponent()({
  name: 'FExpansionPanels',
  props: makeFExpansionPanelsProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const group = useGroup(props, FExpansionPanelsSymbol)
    const headers = new Map<number, HTMLElement>()

    // `mandatory` accordions always keep one panel open.
    watch(
      () => group.items.value.length,
      length => {
        if (!props.mandatory || !length) return
        if (!group.selected.value.length) group.select(group.items.value[0].id, true)
      },
      { flush: 'post' }
    )

    provide(FExpansionPanelsContextSymbol, {
      variant: toRef(() => props.variant),
      readonly: toRef(() => props.readonly),
      disabled: toRef(() => props.disabled),
      registerHeader: (id: number, el: HTMLElement) => {
        headers.set(id, el)
      },
      unregisterHeader: (id: number) => {
        headers.delete(id)
      },
      // WAI-ARIA accordion keyboard support: move focus between headers.
      onHeaderKeydown: (e: KeyboardEvent, id: number) => {
        const items = group.items.value
        const index = items.findIndex(item => item.id === id)
        if (index < 0) return

        let target: number
        if (e.key === 'ArrowDown') target = index + 1
        else if (e.key === 'ArrowUp') target = index - 1
        else if (e.key === 'Home') target = 0
        else if (e.key === 'End') target = items.length - 1
        else return

        e.preventDefault()
        target = ((target % items.length) + items.length) % items.length
        headers.get(items[target].id)?.focus()
      },
      canDeselect: () => !props.mandatory || group.selected.value.length > 1,
    })

    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-expansion-panels',
            `fui-expansion-panels--${props.variant}`,
            { 'fui-expansion-panels--disabled': props.disabled },
            props.class,
          ],
          style: props.style,
        },
        slots.default?.({ selected: group.selected.value })
      )
    )
  },
})
