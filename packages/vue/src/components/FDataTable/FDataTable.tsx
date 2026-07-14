import { computed, toRef } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { provideTheme } from '../../composables/theme'
import { makeFDataTableSharedProps, useDataTableRender } from './shared'
import { makeDataTableFilterProps, useFilteredItems } from './composables/filter'
import { useHeaders } from './composables/headers'
import { useDataTableItems } from './composables/items'
import { useSort, useSortedItems } from './composables/sort'
import {
  useGroupBy,
  useGroupedItems,
  useOpenAllGroups,
  useSortByWithGroups,
} from './composables/group'
import { usePagination, usePaginatedItems } from './composables/pagination'
import { useSelection } from './composables/select'
import { useExpanded } from './composables/expand'
import { useOptions } from './composables/options'
import type { DataTableOptions, SortItem } from './types'

export const makeFDataTableProps = propsFactory(
  {
    ...makeDataTableFilterProps(),
    ...makeFDataTableSharedProps(),
  },
  'FDataTable'
)

/**
 * A client-side data table: it holds every item and does the filtering, sorting,
 * grouping and paging itself. Reach for `FDataTableServer` when the data lives
 * behind an API and the server does that work instead.
 */
export const FDataTable = genericComponent()({
  name: 'FDataTable',
  props: makeFDataTableProps(),
  emits: {
    'update:modelValue': (_v: unknown[]) => true,
    'update:page': (_v: number) => true,
    'update:itemsPerPage': (_v: number) => true,
    'update:sortBy': (_v: SortItem[]) => true,
    'update:groupBy': (_v: SortItem[]) => true,
    'update:opened': (_v: string[]) => true,
    'update:expanded': (_v: unknown[]) => true,
    'update:options': (_v: DataTableOptions) => true,
    'click:row': (_e: MouseEvent, _payload: { item: unknown }) => true,
  },
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const { columns, sortFunctions } = useHeaders(props)
    const { items } = useDataTableItems(props, columns)

    // search → sort (grouping keys first, so groups stay contiguous) → page → group
    const filtered = useFilteredItems(props, items)

    const grouping = useGroupBy(props)
    const sort = useSort(props)
    const sortByWithGroups = useSortByWithGroups(sort.sortBy, grouping.groupBy)
    const sorted = useSortedItems(props, filtered, sortByWithGroups, sortFunctions)

    const itemsLength = computed(() => sorted.value.length)
    const pagination = usePagination(props, itemsLength)
    const pageItems = usePaginatedItems(sorted, pagination)

    const { groups, rows } = useGroupedItems(pageItems, grouping)
    useOpenAllGroups(grouping, () => props.openAll, groups)

    const selection = useSelection(props, {
      // A `select-all` strategy of `all` reaches past the current page, so it
      // needs every item the filter left behind — not just the visible slice.
      allItems: sorted,
      currentPage: pageItems,
    })
    const expansion = useExpanded(props)

    useOptions({
      page: pagination.page,
      itemsPerPage: pagination.itemsPerPage,
      sortBy: sort.sortBy,
      groupBy: grouping.groupBy,
      search: () => props.search,
    })

    useRender(
      useDataTableRender(props, slots, {
        columns,
        rows,
        pageItems,
        itemsLength,
        sort,
        pagination,
        selection,
        expansion,
        grouping,
      })
    )

    return { columns: toRef(() => columns.value) }
  },
})
