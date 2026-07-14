// Shared types for FDataTable / FDataTableServer. The names mirror Vuetify's
// VDataTable so the API surface (headers, sort items, slot payloads) is familiar.

export type SortOrder = 'asc' | 'desc'

export interface SortItem {
  key: string
  order?: SortOrder
}

export type DataTableCompareFunction<T = any> = (a: T, b: T) => number

/** A column definition. `key` is the item property (dotted paths allowed). */
export interface FDataTableHeader<T = any> {
  key: string
  title?: string
  align?: 'start' | 'center' | 'end'
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  /** Pin the column to the start of the table while the body scrolls sideways. */
  fixed?: boolean
  /** Custom comparator used when this column is sorted. */
  sort?: DataTableCompareFunction
  /** Resolve the cell value from the raw item (path or getter) when it differs from `key`. */
  value?: string | ((item: T) => unknown)
}

/** A header after normalization — every optional field resolved. */
export interface InternalDataTableHeader<T = any> extends FDataTableHeader<T> {
  title: string
  align: 'start' | 'center' | 'end'
  sortable: boolean
  fixed: boolean
  /** Distance from the start edge, in px, when `fixed`. */
  fixedOffset: number
  /** The last pinned column — carries the separating shadow. */
  lastFixed: boolean
}

/** A raw item after normalization: identity, column values and selectability. */
export interface DataTableItem<T = any> {
  type: 'item'
  /** Row identity, derived from `itemValue` (falls back to the index). */
  value: unknown
  index: number
  raw: T
  columns: Record<string, unknown>
  selectable: boolean
}

export interface DataTableGroup<T = any> {
  type: 'group'
  id: string
  key: string
  value: unknown
  depth: number
  /** Every leaf item below this group (used for the count badge). */
  items: DataTableItem<T>[]
  /** Direct children — items, or nested groups when grouping by several keys. */
  rows: DataTableRow<T>[]
}

export type DataTableRow<T = any> = DataTableItem<T> | DataTableGroup<T>

/** How a row's identity / selectability is read off an item. */
export type ItemKey<T = any> = string | ((item: T) => unknown)

/** `customFilter(value, query, item)` — run against each column value of a row. */
export type FilterFunction<T = any> = (
  value: unknown,
  query: string,
  item: DataTableItem<T>
) => boolean

export interface DataTableOptions {
  page: number
  itemsPerPage: number
  sortBy: SortItem[]
  groupBy: SortItem[]
  search: string | undefined
}
