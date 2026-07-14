import { computed, watch } from 'vue'
import type { ComputedRef, PropType, Ref, WritableComputedRef } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import { useProxiedModel } from '../../../composables/proxiedModel'

export type ItemsPerPageOption = number | { value: number; title: string }

export const makeDataTablePaginateProps = propsFactory(
  {
    page: { type: [Number, String] as PropType<number | string>, default: 1 },
    // `-1` shows every item on a single page.
    itemsPerPage: { type: [Number, String] as PropType<number | string>, default: 10 },
    itemsPerPageOptions: {
      type: Array as PropType<ItemsPerPageOption[]>,
      default: () => [10, 25, 50, 100],
    },
    itemsPerPageText: { type: String, default: 'Items per page:' },
    // `{0}` first row, `{1}` last row, `{2}` total.
    pageText: { type: String, default: '{0}–{1} of {2}' },
    hideDefaultFooter: Boolean,
  },
  'FDataTable-paginate'
)

interface PaginationProps {
  page: number | string
  itemsPerPage: number | string
}

export interface PaginationProvide {
  page: WritableComputedRef<number>
  itemsPerPage: WritableComputedRef<number>
  startIndex: ComputedRef<number>
  stopIndex: ComputedRef<number>
  pageCount: ComputedRef<number>
  setPage: (value: number) => void
  setItemsPerPage: (value: number) => void
  nextPage: () => void
  prevPage: () => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Page state. Works for both tables: the client one passes the filtered length,
 * the server one passes the `itemsLength` it was told about.
 */
export function usePagination(
  props: PaginationProps,
  itemsLength: Ref<number> | ComputedRef<number>
): PaginationProvide {
  const page = useProxiedModel(props as any, 'page', 1, (v: unknown) =>
    Number(v ?? 1)
  ) as WritableComputedRef<number>
  const itemsPerPage = useProxiedModel(props as any, 'itemsPerPage', 10, (v: unknown) =>
    Number(v ?? 10)
  ) as WritableComputedRef<number>

  const startIndex = computed(() =>
    itemsPerPage.value === -1 ? 0 : itemsPerPage.value * (page.value - 1)
  )
  const stopIndex = computed(() =>
    itemsPerPage.value === -1
      ? itemsLength.value
      : Math.min(itemsLength.value, startIndex.value + itemsPerPage.value)
  )
  const pageCount = computed(() =>
    itemsPerPage.value === -1 || itemsLength.value === 0
      ? 1
      : Math.ceil(itemsLength.value / itemsPerPage.value)
  )

  // Items can arrive after the first render (async fetch), so never clamp eagerly.
  watch([page, pageCount], () => {
    if (page.value > pageCount.value) page.value = pageCount.value
  })

  function setPage(value: number): void {
    page.value = clamp(value, 1, pageCount.value)
  }

  function setItemsPerPage(value: number): void {
    itemsPerPage.value = value
    page.value = 1
  }

  return {
    page,
    itemsPerPage,
    startIndex,
    stopIndex,
    pageCount,
    setPage,
    setItemsPerPage,
    nextPage: () => setPage(page.value + 1),
    prevPage: () => setPage(page.value - 1),
  }
}

/** Slices the rows down to the current page. */
export function usePaginatedItems<T>(
  items: ComputedRef<T[]>,
  { startIndex, stopIndex, itemsPerPage }: PaginationProvide
): ComputedRef<T[]> {
  return computed(() =>
    itemsPerPage.value === -1 ? items.value : items.value.slice(startIndex.value, stopIndex.value)
  )
}
