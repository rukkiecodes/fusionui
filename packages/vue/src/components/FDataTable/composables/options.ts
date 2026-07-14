import { computed, watch } from 'vue'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { getCurrentInstance } from '../../../util/getCurrentInstance'
import type { DataTableOptions, SortItem } from '../types'

interface OptionsSources {
  page: Ref<number> | WritableComputedRef<number>
  itemsPerPage: Ref<number> | WritableComputedRef<number>
  sortBy: ComputedRef<SortItem[]> | WritableComputedRef<SortItem[]>
  groupBy: ComputedRef<SortItem[]> | WritableComputedRef<SortItem[]>
  search: () => string | undefined
}

function sameOptions(a: DataTableOptions | null, b: DataTableOptions): boolean {
  if (!a) return false
  return (
    a.page === b.page &&
    a.itemsPerPage === b.itemsPerPage &&
    a.search === b.search &&
    JSON.stringify(a.sortBy) === JSON.stringify(b.sortBy) &&
    JSON.stringify(a.groupBy) === JSON.stringify(b.groupBy)
  )
}

/**
 * Emits `update:options` whenever page / items-per-page / sort / group / search
 * change — the single event a server-driven table listens to. Fires immediately
 * so the first fetch can be driven by it too.
 */
export function useOptions(sources: OptionsSources): ComputedRef<DataTableOptions> {
  const vm = getCurrentInstance('useOptions')

  const options = computed<DataTableOptions>(() => ({
    page: sources.page.value,
    itemsPerPage: sources.itemsPerPage.value,
    sortBy: [...sources.sortBy.value],
    groupBy: [...sources.groupBy.value],
    search: sources.search(),
  }))

  let previous: DataTableOptions | null = null

  watch(
    options,
    value => {
      if (sameOptions(previous, value)) return
      // A new search invalidates the page the user was on.
      if (previous && previous.search !== value.search && value.page !== 1) {
        sources.page.value = 1
        return
      }
      previous = value
      vm.emit('update:options', value)
    },
    { deep: true, immediate: true }
  )

  return options
}
