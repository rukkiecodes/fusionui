import { computed } from 'vue'
import type { ComputedRef, PropType } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import type { DataTableCompareFunction, FDataTableHeader, InternalDataTableHeader } from '../types'

export const makeDataTableHeaderProps = propsFactory(
  {
    headers: { type: Array as PropType<FDataTableHeader[]>, default: undefined },
  },
  'FDataTable-headers'
)

interface HeaderProps {
  headers?: FDataTableHeader[]
  items: unknown[]
}

function titleize(key: string): string {
  const spaced = key.replace(/[._-]/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/**
 * Normalizes the `headers` prop into columns. Without headers the columns are
 * inferred from the first item, the way Vuetify does.
 *
 * Pinned (`fixed`) columns get a resolved start offset so several of them can
 * stack; the last one carries the separator shadow.
 */
export function useHeaders(props: HeaderProps): {
  columns: ComputedRef<InternalDataTableHeader[]>
  sortFunctions: ComputedRef<Record<string, DataTableCompareFunction>>
} {
  const columns = computed<InternalDataTableHeader[]>(() => {
    const source: FDataTableHeader[] =
      props.headers ??
      Object.keys((props.items[0] as Record<string, unknown>) ?? {}).map(key => ({
        key,
        title: titleize(key),
      }))

    const normalized = source.map(header => ({
      ...header,
      title: header.title ?? titleize(header.key),
      align: header.align ?? 'start',
      sortable: header.sortable ?? true,
      fixed: header.fixed ?? false,
      fixedOffset: 0,
      lastFixed: false,
    })) as InternalDataTableHeader[]

    let offset = 0
    let lastFixedIndex = -1
    normalized.forEach((column, index) => {
      if (!column.fixed) return
      column.fixedOffset = offset
      offset += parseFloat(String(column.width ?? 0)) || 0
      lastFixedIndex = index
    })
    if (lastFixedIndex > -1) normalized[lastFixedIndex].lastFixed = true

    return normalized
  })

  const sortFunctions = computed<Record<string, DataTableCompareFunction>>(() => {
    const functions: Record<string, DataTableCompareFunction> = {}
    for (const column of columns.value) {
      if (column.sort) functions[column.key] = column.sort
    }
    return functions
  })

  return { columns, sortFunctions }
}
