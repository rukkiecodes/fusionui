import { computed, watch } from 'vue'
import type { ComputedRef, PropType, WritableComputedRef } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import { useProxiedModel } from '../../../composables/proxiedModel'
import { getObjectValueByPath } from './items'
import type { DataTableGroup, DataTableItem, DataTableRow, SortItem } from '../types'

export const makeDataTableGroupProps = propsFactory(
  {
    // One entry per grouping level: `[{ key: 'department' }]`.
    groupBy: { type: Array as PropType<SortItem[]>, default: () => [] },
    // The ids of the expanded groups.
    opened: { type: Array as PropType<string[]>, default: () => [] },
    openAll: Boolean,
  },
  'FDataTable-group'
)

interface GroupProps {
  groupBy: SortItem[]
  opened: string[]
  openAll: boolean
}

export interface GroupProvide {
  groupBy: WritableComputedRef<SortItem[]>
  opened: WritableComputedRef<Set<string>>
  isGroupOpen: (group: DataTableGroup) => boolean
  toggleGroup: (group: DataTableGroup) => void
}

/** Group state: which keys the rows are grouped by, and which groups are open. */
export function useGroupBy(props: GroupProps): GroupProvide {
  const groupBy = useProxiedModel(props as any, 'groupBy', [] as SortItem[]) as WritableComputedRef<
    SortItem[]
  >

  const opened = useProxiedModel(
    props as any,
    'opened',
    [],
    (v: unknown) => new Set<string>(Array.isArray(v) ? v : []),
    (v: Set<string>) => [...v.values()]
  ) as WritableComputedRef<Set<string>>

  function isGroupOpen(group: DataTableGroup): boolean {
    return opened.value.has(group.id)
  }

  function toggleGroup(group: DataTableGroup): void {
    const next = new Set(opened.value)
    if (next.has(group.id)) next.delete(group.id)
    else next.add(group.id)
    opened.value = next
  }

  return { groupBy, opened, isGroupOpen, toggleGroup }
}

/**
 * Grouping keys are prepended to `sortBy` (with no order of their own) so rows
 * of the same group stay contiguous while the user's own sort still applies
 * inside each group.
 */
export function useSortByWithGroups(
  sortBy: ComputedRef<SortItem[]> | WritableComputedRef<SortItem[]>,
  groupBy: ComputedRef<SortItem[]> | WritableComputedRef<SortItem[]>
): ComputedRef<SortItem[]> {
  return computed(() => [
    ...groupBy.value.map(group => ({ key: group.key, order: group.order ?? 'asc' })),
    ...sortBy.value,
  ])
}

function groupValue(item: DataTableItem, key: string): unknown {
  return key in item.columns ? item.columns[key] : getObjectValueByPath(item.raw, key)
}

function groupItems(
  items: DataTableItem[],
  keys: string[],
  depth = 0,
  parentId = 'root'
): DataTableGroup[] {
  if (!keys.length) return []

  const [key, ...rest] = keys
  const buckets = new Map<unknown, DataTableItem[]>()
  for (const item of items) {
    const value = groupValue(item, key)
    if (!buckets.has(value)) buckets.set(value, [])
    buckets.get(value)!.push(item)
  }

  const groups: DataTableGroup[] = []
  for (const [value, bucket] of buckets) {
    const id = `${parentId}_${key}_${String(value)}`
    groups.push({
      type: 'group',
      id,
      key,
      value,
      depth,
      items: bucket,
      rows: rest.length ? groupItems(bucket, rest, depth + 1, id) : bucket,
    })
  }
  return groups
}

function flatten(rows: DataTableRow[], isOpen: (group: DataTableGroup) => boolean): DataTableRow[] {
  const out: DataTableRow[] = []
  for (const row of rows) {
    if (row.type !== 'group') {
      out.push(row)
      continue
    }
    out.push(row)
    if (isOpen(row)) out.push(...flatten(row.rows, isOpen))
  }
  return out
}

function collectIds(groups: DataTableGroup[]): string[] {
  return groups.flatMap(group => [
    group.id,
    ...collectIds(group.rows.filter((row): row is DataTableGroup => row.type === 'group')),
  ])
}

/**
 * Turns the (already sorted + paginated) rows into the flat list the body
 * renders: a header row per group, followed by its rows when the group is open.
 */
export function useGroupedItems(
  items: ComputedRef<DataTableItem[]>,
  group: GroupProvide
): { groups: ComputedRef<DataTableGroup[]>; rows: ComputedRef<DataTableRow[]> } {
  const groups = computed(() =>
    group.groupBy.value.length
      ? groupItems(
          items.value,
          group.groupBy.value.map(item => item.key)
        )
      : []
  )

  const rows = computed<DataTableRow[]>(() =>
    group.groupBy.value.length ? flatten(groups.value, group.isGroupOpen) : items.value
  )

  return { groups, rows }
}

/** `open-all`: newly appearing groups start expanded, without re-opening closed ones. */
export function useOpenAllGroups(
  group: GroupProvide,
  openAll: () => boolean,
  groups: ComputedRef<DataTableGroup[]>
): void {
  const allIds = computed(() => (openAll() ? new Set(collectIds(groups.value)) : new Set<string>()))

  watch(
    allIds,
    (ids, previous) => {
      if (!openAll()) return

      const next = new Set(group.opened.value)
      let changed = false
      for (const id of ids) {
        if (!previous?.has(id) && !next.has(id)) {
          next.add(id)
          changed = true
        }
      }
      if (changed) group.opened.value = next
    },
    { immediate: true }
  )
}
