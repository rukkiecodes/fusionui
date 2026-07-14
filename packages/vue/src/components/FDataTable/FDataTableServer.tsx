import { computed, toRef } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { provideTheme } from '../../composables/theme'
import { makeFDataTableSharedProps, useDataTableRender } from './shared'
import { useHeaders } from './composables/headers'
import { useDataTableItems } from './composables/items'
import { useSort } from './composables/sort'
import { useGroupBy, useGroupedItems, useOpenAllGroups } from './composables/group'
import { usePagination } from './composables/pagination'
import { useSelection } from './composables/select'
import { useExpanded } from './composables/expand'
import { useOptions } from './composables/options'
import type { DataTableOptions, SortItem } from './types'

export const makeFDataTableServerProps = propsFactory(
  {
    /** Total rows behind the query — the "of 42" in the footer, and the page count. */
    itemsLength: {
      type: [Number, String] as PropType<number | string>,
      required: true as const,
    },
    /** Forwarded to `update:options` so a search can drive the fetch. */
    search: { type: String as PropType<string>, default: undefined },
    ...makeFDataTableSharedProps(),
  },
  'FDataTableServer'
)

/**
 * A server-driven data table. It renders exactly what it is given and never
 * filters, sorts or slices locally: instead it emits `update:options` whenever
 * the page, page size, sort or group changes, and you refetch `items` in
 * response. `itemsLength` tells it how many rows exist behind the query.
 */
export const FDataTableServer = genericComponent()({
  name: 'FDataTableServer',
  props: makeFDataTableServerProps(),
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

    const { columns } = useHeaders(props)
    const { items } = useDataTableItems(props, columns)

    const itemsLength = computed(() => Number(props.itemsLength) || 0)

    const grouping = useGroupBy(props)
    const sort = useSort(props)
    const pagination = usePagination(props, itemsLength)

    // `items` is already the current page, sorted by the server — group it for
    // display, but never re-slice or re-sort it here.
    const { groups, rows } = useGroupedItems(items, grouping)
    useOpenAllGroups(grouping, () => props.openAll, groups)

    const selection = useSelection(props, {
      allItems: items,
      currentPage: items,
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
        pageItems: items,
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
