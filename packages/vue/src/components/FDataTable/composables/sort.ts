import { computed } from 'vue'
import type { ComputedRef, PropType, Ref, WritableComputedRef } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import { useProxiedModel } from '../../../composables/proxiedModel'
import { getObjectValueByPath } from './items'
import type {
  DataTableCompareFunction,
  DataTableItem,
  InternalDataTableHeader,
  SortItem,
  SortOrder,
} from '../types'

export const makeDataTableSortProps = propsFactory(
  {
    sortBy: { type: Array as PropType<SortItem[]>, default: () => [] },
    // Keep every clicked column in `sortBy` instead of replacing the previous one.
    multiSort: Boolean,
    // A column can never be un-sorted back to its natural order.
    mustSort: Boolean,
    // Per-column comparators by key (a header's own `sort` wins over these).
    customKeySort: {
      type: Object as PropType<Record<string, DataTableCompareFunction>>,
      default: undefined,
    },
    // Ignore `sortable` on every column.
    disableSort: Boolean,
  },
  'FDataTable-sort'
)

interface SortProps {
  sortBy: SortItem[]
  multiSort: boolean
  mustSort: boolean
  disableSort: boolean
  customKeySort?: Record<string, DataTableCompareFunction>
}

export interface SortProvide {
  sortBy: WritableComputedRef<SortItem[]>
  toggleSort: (column: InternalDataTableHeader) => void
  sortOrder: (key: string) => SortOrder | undefined
  sortIndex: (key: string) => number
  isSorted: (key: string) => boolean
}

/**
 * Sort state. A click cycles a column asc → desc → unsorted (`mustSort` keeps
 * the last column sorted); with `multiSort` each new column is appended so the
 * table sorts by several keys, in click order.
 */
export function useSort(props: SortProps, page?: Ref<number>): SortProvide {
  const sortBy = useProxiedModel(props as any, 'sortBy', [] as SortItem[]) as WritableComputedRef<
    SortItem[]
  >

  function toggleSort(column: InternalDataTableHeader): void {
    if (props.disableSort || !column.sortable || !column.key) return

    let next = (sortBy.value ?? []).map(item => ({ ...item }))
    const existing = next.find(item => item.key === column.key)

    if (!existing) {
      if (props.multiSort) next.push({ key: column.key, order: 'asc' })
      else next = [{ key: column.key, order: 'asc' }]
    } else if (existing.order === 'desc') {
      if (props.mustSort && next.length === 1) existing.order = 'asc'
      else next = next.filter(item => item.key !== column.key)
    } else {
      existing.order = 'desc'
    }

    sortBy.value = next
    // A re-sort invalidates the current page — always go back to the first one.
    if (page) page.value = 1
  }

  function sortOrder(key: string): SortOrder | undefined {
    return (sortBy.value ?? []).find(item => item.key === key)?.order ?? undefined
  }

  function sortIndex(key: string): number {
    return (sortBy.value ?? []).findIndex(item => item.key === key)
  }

  return {
    sortBy,
    toggleSort,
    sortOrder,
    sortIndex,
    isSorted: (key: string) => sortIndex(key) > -1,
  }
}

function getSortValue(item: DataTableItem, key: string): unknown {
  return key in item.columns ? item.columns[key] : getObjectValueByPath(item.raw, key)
}

function isEmpty(value: unknown): boolean {
  return value == null || value === ''
}

/** Sorts normalized rows by every entry in `sortBy`, in order. */
export function sortItems(
  items: DataTableItem[],
  sortBy: SortItem[],
  sortFunctions: Record<string, DataTableCompareFunction> = {}
): DataTableItem[] {
  if (!sortBy.length) return items

  // `undefined` locale = the runtime default; Intl exists on the server too.
  const collator = new Intl.Collator(undefined, { sensitivity: 'accent', usage: 'sort' })

  return [...items].sort((a, b) => {
    for (const { key, order } of sortBy) {
      // `order: undefined` = grouping key, only used to keep groups contiguous.
      let sortA = getSortValue(a, key)
      let sortB = getSortValue(b, key)

      if (order === 'desc') {
        ;[sortA, sortB] = [sortB, sortA]
      }

      const custom = sortFunctions[key]
      if (custom) {
        const result = custom(sortA, sortB)
        if (result) return result
        continue
      }

      if (sortA instanceof Date && sortB instanceof Date) {
        const diff = sortA.getTime() - sortB.getTime()
        if (diff) return diff
        continue
      }

      if (typeof sortA === 'number' && typeof sortB === 'number') {
        if (sortA !== sortB) return sortA - sortB
        continue
      }

      if (isEmpty(sortA) && isEmpty(sortB)) continue
      if (isEmpty(sortA)) return -1
      if (isEmpty(sortB)) return 1

      const result = collator.compare(String(sortA), String(sortB))
      if (result) return result
    }
    return 0
  })
}

export function useSortedItems(
  props: SortProps,
  items: ComputedRef<DataTableItem[]>,
  sortBy: ComputedRef<SortItem[]>,
  sortFunctions: ComputedRef<Record<string, DataTableCompareFunction>>
): ComputedRef<DataTableItem[]> {
  return computed(() =>
    sortItems(items.value, sortBy.value, {
      ...props.customKeySort,
      ...sortFunctions.value,
    })
  )
}
