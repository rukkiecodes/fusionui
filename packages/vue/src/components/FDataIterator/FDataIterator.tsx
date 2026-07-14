import { computed, h, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { FProgressCircular } from '../FProgress'

export type FDataIteratorSortOrder = 'asc' | 'desc'

export interface FDataIteratorSortItem {
  key: string
  order?: FDataIteratorSortOrder
}

/** Reads `a.b.c` off an item — plain keys are just the degenerate case. */
function getPath(item: any, key: string): unknown {
  if (item == null) return undefined
  if (!key.includes('.')) return item[key]
  return key.split('.').reduce<any>((value, part) => (value == null ? value : value[part]), item)
}

function normalizeSort(sortBy: (string | FDataIteratorSortItem)[]): FDataIteratorSortItem[] {
  return (sortBy ?? []).map(entry =>
    typeof entry === 'string' ? { key: entry, order: 'asc' as const } : entry
  )
}

/** Deterministic compare across strings, numbers and dates; nullish values sink. */
function compare(a: unknown, b: unknown): number {
  if (a === b) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

export const makeFDataIteratorProps = propsFactory(
  {
    items: { type: Array as PropType<any[]>, default: () => [] },
    itemsPerPage: { type: [Number, String] as PropType<number | string>, default: 5 },
    page: { type: [Number, String] as PropType<number | string>, default: 1 },
    search: String as PropType<string>,
    /** Custom predicate — replaces the built-in `search` matching entirely. */
    filter: Function as PropType<(item: any, search: string) => boolean>,
    /** Restrict the built-in search to these keys (dot paths allowed). */
    filterKeys: { type: [String, Array] as PropType<string | string[]>, default: undefined },
    sortBy: {
      type: Array as PropType<(string | FDataIteratorSortItem)[]>,
      default: () => [],
    },
    /** Let `toggleSort` stack keys instead of replacing the current one. */
    multiSort: Boolean,
    loading: Boolean,
    /** Set for server-driven data: pagination/sorting/filtering are then yours to do. */
    itemsLength: { type: [Number, String] as PropType<number | string>, default: undefined },
    noDataText: { type: String as PropType<string>, default: 'No data available' },
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FDataIterator'
)

/**
 * The layout-free sibling of a data table: it filters, sorts and paginates a list
 * and hands the current slice to its default slot. Everything you see is yours —
 * a card grid, a masonry wall, a list of rows.
 */
export const FDataIterator = genericComponent()({
  name: 'FDataIterator',
  props: makeFDataIteratorProps(),
  emits: {
    'update:page': (_v: number) => true,
    'update:itemsPerPage': (_v: number) => true,
    'update:sortBy': (_v: FDataIteratorSortItem[]) => true,
  },
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const page = useProxiedModel(props, 'page', 1, v => Number(v ?? 1))
    const itemsPerPage = useProxiedModel(props, 'itemsPerPage', 5, v => Number(v ?? 5))
    const sortBy = useProxiedModel(props, 'sortBy', [], v =>
      normalizeSort(v as (string | FDataIteratorSortItem)[])
    )

    // Server-driven mode: the parent already sliced the data, we only do the maths.
    const isServerSide = computed(() => props.itemsLength !== undefined && props.itemsLength !== '')

    const searchQuery = computed(() =>
      String(props.search ?? '')
        .trim()
        .toLowerCase()
    )

    const filteredItems = computed<any[]>(() => {
      const items = props.items ?? []
      if (isServerSide.value || !searchQuery.value) return items
      const query = searchQuery.value

      if (props.filter) return items.filter((item: any) => !!props.filter(item, query))

      const keys = props.filterKeys
        ? Array.isArray(props.filterKeys)
          ? props.filterKeys
          : [props.filterKeys]
        : null

      return items.filter((item: any) => {
        const values = keys
          ? keys.map((key: string) => getPath(item, key))
          : Object.values(item ?? {})
        return values.some(
          (value: unknown) =>
            (typeof value === 'string' || typeof value === 'number') &&
            String(value).toLowerCase().includes(query)
        )
      })
    })

    const sortedItems = computed<any[]>(() => {
      const items = filteredItems.value
      const sort = sortBy.value
      if (isServerSide.value || !sort.length) return items
      return [...items].sort((a, b) => {
        for (const { key, order } of sort) {
          const result = compare(getPath(a, key), getPath(b, key))
          if (result !== 0) return order === 'desc' ? -result : result
        }
        return 0
      })
    })

    const itemsLength = computed(() =>
      isServerSide.value ? Number(props.itemsLength) : sortedItems.value.length
    )
    // `itemsPerPage: -1` (or 0) is the "show everything" escape hatch.
    const isPaginated = computed(() => itemsPerPage.value > 0)
    const pageCount = computed(() =>
      isPaginated.value ? Math.max(1, Math.ceil(itemsLength.value / itemsPerPage.value)) : 1
    )

    const paginatedItems = computed<any[]>(() => {
      if (isServerSide.value || !isPaginated.value) return sortedItems.value
      const start = (page.value - 1) * itemsPerPage.value
      return sortedItems.value.slice(start, start + itemsPerPage.value)
    })

    // Searching (or a shrinking data set) can strand the reader on a page that no
    // longer exists — walk them back to the last real one.
    watch(pageCount, count => {
      if (page.value > count) page.value = count
    })

    function setPage(value: number): void {
      page.value = Math.min(pageCount.value, Math.max(1, Math.round(value)))
    }
    function nextPage(): void {
      setPage(page.value + 1)
    }
    function prevPage(): void {
      setPage(page.value - 1)
    }
    function setItemsPerPage(value: number): void {
      itemsPerPage.value = Number(value)
      setPage(1)
    }

    function sortOrder(key: string): FDataIteratorSortOrder | undefined {
      return (
        sortBy.value.find((entry: FDataIteratorSortItem) => entry.key === key)?.order ?? undefined
      )
    }

    /** asc → desc → unsorted, the cycle every sortable header has taught people. */
    function toggleSort(key: string): void {
      const current = sortBy.value.find((entry: FDataIteratorSortItem) => entry.key === key)
      const rest = props.multiSort
        ? sortBy.value.filter((entry: FDataIteratorSortItem) => entry.key !== key)
        : []

      let next: FDataIteratorSortItem[]
      if (!current) next = [...rest, { key, order: 'asc' }]
      else if (current.order === 'asc') next = [...rest, { key, order: 'desc' }]
      else next = rest

      sortBy.value = next
      setPage(1)
    }

    const slotProps = computed(() => ({
      items: paginatedItems.value,
      page: page.value,
      pageCount: pageCount.value,
      itemsPerPage: itemsPerPage.value,
      itemsLength: itemsLength.value,
      isFirst: page.value <= 1,
      isLast: page.value >= pageCount.value,
      prevPage,
      nextPage,
      setPage,
      setItemsPerPage,
      sortBy: sortBy.value,
      sortOrder,
      toggleSort,
      loading: !!props.loading,
      search: props.search,
    }))

    useRender(() => {
      const empty = !paginatedItems.value.length

      return h(
        props.tag,
        {
          class: [
            'fui-data-iterator',
            { 'fui-data-iterator--loading': props.loading },
            props.class,
          ],
          style: props.style,
          'aria-busy': props.loading ? 'true' : undefined,
        },
        [
          slots.header?.(slotProps.value),
          props.loading
            ? slots.loading
              ? slots.loading(slotProps.value)
              : h('div', { class: 'fui-data-iterator__loader' }, [
                  h(FProgressCircular, { indeterminate: true, size: 32 }),
                ])
            : empty
              ? slots['no-data']
                ? slots['no-data']()
                : h('div', { class: 'fui-data-iterator__no-data' }, props.noDataText)
              : slots.default?.(slotProps.value),
          slots.footer?.(slotProps.value),
        ]
      )
    })
  },
})
