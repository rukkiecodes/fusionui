import { computed } from 'vue'
import type { ComputedRef, PropType } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import type { DataTableItem, FilterFunction } from '../types'

export const makeDataTableFilterProps = propsFactory(
  {
    search: { type: String as PropType<string>, default: undefined },
    // (value, query, item) => boolean — run against every column value of a row.
    customFilter: { type: Function as PropType<FilterFunction>, default: undefined },
    // Restrict the search to these column keys (all columns by default).
    filterKeys: { type: Array as PropType<string[]>, default: undefined },
  },
  'FDataTable-filter'
)

interface FilterProps {
  search?: string
  customFilter?: FilterFunction
  filterKeys?: string[]
}

/** The default match: a case-insensitive substring test on the stringified value. */
export function defaultFilter(value: unknown, query: string): boolean {
  if (value == null) return false
  return String(value).toLowerCase().includes(query)
}

/**
 * Client-side search. A row matches when any of its column values matches the
 * query — via `customFilter` when supplied, otherwise a substring test.
 */
export function useFilteredItems(
  props: FilterProps,
  items: ComputedRef<DataTableItem[]>
): ComputedRef<DataTableItem[]> {
  return computed(() => {
    const query = (props.search ?? '').trim().toLowerCase()
    if (!query) return items.value

    const match = props.customFilter ?? ((value: unknown, q: string) => defaultFilter(value, q))

    return items.value.filter(item => {
      const keys = props.filterKeys ?? Object.keys(item.columns)
      return keys.some(key => match(item.columns[key], query, item))
    })
  })
}
