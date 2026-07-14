import type { PropType, WritableComputedRef } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import { useProxiedModel } from '../../../composables/proxiedModel'
import type { DataTableItem } from '../types'

export const makeDataTableExpandProps = propsFactory(
  {
    showExpand: Boolean,
    // Clicking anywhere on the row toggles it (as well as the chevron).
    expandOnClick: Boolean,
    // The `itemValue` of every expanded row.
    expanded: { type: Array as PropType<any[]>, default: () => [] },
    expandStrategy: { type: String as PropType<'single' | 'multiple'>, default: 'multiple' },
  },
  'FDataTable-expand'
)

interface ExpandProps {
  expanded: any[]
  expandStrategy: 'single' | 'multiple'
}

export interface ExpandProvide {
  expanded: WritableComputedRef<Set<unknown>>
  isExpanded: (item: DataTableItem) => boolean
  toggleExpand: (item: DataTableItem) => void
}

/** Row expansion — the detail row rendered under an item by the `expanded-row` slot. */
export function useExpanded(props: ExpandProps): ExpandProvide {
  const expanded = useProxiedModel(
    props as any,
    'expanded',
    [],
    (v: unknown) => new Set(Array.isArray(v) ? v : v == null ? [] : [v]),
    (v: Set<unknown>) => [...v.values()]
  ) as WritableComputedRef<Set<unknown>>

  function isExpanded(item: DataTableItem): boolean {
    return expanded.value.has(item.value)
  }

  function toggleExpand(item: DataTableItem): void {
    const open = !isExpanded(item)
    const next =
      open && props.expandStrategy === 'single' ? new Set<unknown>() : new Set(expanded.value)

    if (open) next.add(item.value)
    else next.delete(item.value)

    expanded.value = next
  }

  return { expanded, isExpanded, toggleExpand }
}
