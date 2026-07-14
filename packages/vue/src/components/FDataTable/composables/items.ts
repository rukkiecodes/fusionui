import { computed } from 'vue'
import type { ComputedRef, PropType, Ref } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import type { DataTableItem, InternalDataTableHeader, ItemKey } from '../types'

/** Reads a dotted path (`address.city`, `tags[0]`) off an object. */
export function getObjectValueByPath(obj: unknown, path?: string, fallback?: unknown): unknown {
  if (obj == null || !path) return fallback
  const record = obj as Record<string, unknown>
  if (path in record) return record[path]

  const segments = path
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')

  let value: unknown = obj
  for (const segment of segments) {
    if (value == null || typeof value !== 'object') return fallback
    value = (value as Record<string, unknown>)[segment]
  }
  return value === undefined ? fallback : value
}

/** Resolves an `ItemKey` (property path or getter) against a raw item. */
export function getItemKeyValue<T>(item: T, key: ItemKey<T> | undefined): unknown {
  if (key == null) return undefined
  return typeof key === 'function' ? key(item) : getObjectValueByPath(item, key)
}

/** The value shown in a cell: the header's `value` override, else its `key`. */
export function getColumnValue<T>(item: T, column: InternalDataTableHeader<T>): unknown {
  return column.value != null
    ? getItemKeyValue(item, column.value)
    : getObjectValueByPath(item, column.key)
}

export const makeDataTableItemsProps = propsFactory(
  {
    items: { type: Array as PropType<any[]>, default: () => [] },
    // Row identity — what lands in `modelValue` / `expanded`.
    itemValue: { type: [String, Function] as PropType<ItemKey>, default: 'id' },
    // Rows whose value here is falsy cannot be selected.
    itemSelectable: { type: [String, Function] as PropType<ItemKey>, default: undefined },
  },
  'FDataTable-items'
)

interface ItemsProps {
  items: unknown[]
  itemValue: ItemKey
  itemSelectable?: ItemKey
}

/** Normalizes the raw `items` into rows carrying identity + per-column values. */
export function useDataTableItems(
  props: ItemsProps,
  columns: Ref<InternalDataTableHeader[]> | ComputedRef<InternalDataTableHeader[]>
): { items: ComputedRef<DataTableItem[]> } {
  const items = computed<DataTableItem[]>(() =>
    props.items.map((raw, index) => {
      const value = getItemKeyValue(raw, props.itemValue)
      const cells: Record<string, unknown> = {}
      for (const column of columns.value) {
        cells[column.key] = getColumnValue(raw, column)
      }
      return {
        type: 'item',
        value: value ?? index,
        index,
        raw,
        columns: cells,
        selectable: props.itemSelectable == null || !!getItemKeyValue(raw, props.itemSelectable),
      }
    })
  )

  return { items }
}
