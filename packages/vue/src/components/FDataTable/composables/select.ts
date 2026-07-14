import { computed } from 'vue'
import type { ComputedRef, PropType, WritableComputedRef } from 'vue'
import { propsFactory } from '../../../util/propsFactory'
import { useProxiedModel } from '../../../composables/proxiedModel'
import type { DataTableItem } from '../types'

export type SelectStrategy = 'single' | 'page' | 'all'

export const makeDataTableSelectProps = propsFactory(
  {
    showSelect: Boolean,
    // single = one row, no select-all · page = select-all covers the current page
    // · all = select-all covers every item.
    selectStrategy: { type: String as PropType<SelectStrategy>, default: 'page' },
    modelValue: { type: Array as PropType<any[]>, default: () => [] },
  },
  'FDataTable-select'
)

interface SelectProps {
  showSelect: boolean
  selectStrategy: SelectStrategy
  modelValue: any[]
}

export interface SelectionProvide {
  selected: WritableComputedRef<Set<unknown>>
  isSelected: (item: DataTableItem) => boolean
  toggleSelect: (item: DataTableItem) => void
  select: (items: DataTableItem[], value: boolean) => void
  selectAll: (value: boolean) => void
  someSelected: ComputedRef<boolean>
  allSelected: ComputedRef<boolean>
  showSelectAll: ComputedRef<boolean>
}

/**
 * Row selection. `modelValue` holds the `itemValue` of every selected row; the
 * strategy decides what the header checkbox covers (and whether it exists).
 */
export function useSelection(
  props: SelectProps,
  {
    allItems,
    currentPage,
  }: { allItems: ComputedRef<DataTableItem[]>; currentPage: ComputedRef<DataTableItem[]> }
): SelectionProvide {
  const selected = useProxiedModel(
    props as any,
    'modelValue',
    [],
    (v: unknown) => new Set(Array.isArray(v) ? v : v == null ? [] : [v]),
    (v: Set<unknown>) => [...v.values()]
  ) as WritableComputedRef<Set<unknown>>

  const allSelectable = computed(() => allItems.value.filter(item => item.selectable))
  const pageSelectable = computed(() => currentPage.value.filter(item => item.selectable))

  // The rows the header checkbox reflects and acts on.
  const scope = computed(() =>
    props.selectStrategy === 'all' ? allSelectable.value : pageSelectable.value
  )

  const showSelectAll = computed(() => props.selectStrategy !== 'single')

  function isSelected(item: DataTableItem): boolean {
    return selected.value.has(item.value)
  }

  function select(items: DataTableItem[], value: boolean): void {
    // `single` never keeps more than one row selected.
    const next = props.selectStrategy === 'single' ? new Set<unknown>() : new Set(selected.value)

    for (const item of items) {
      if (!item.selectable) continue
      if (value) next.add(item.value)
      else next.delete(item.value)
    }

    selected.value = next
  }

  function toggleSelect(item: DataTableItem): void {
    select([item], !isSelected(item))
  }

  function selectAll(value: boolean): void {
    if (props.selectStrategy === 'single') return
    select(scope.value, value)
  }

  const someSelected = computed(() => scope.value.some(item => isSelected(item)))
  const allSelected = computed(
    () => !!scope.value.length && scope.value.every(item => isSelected(item))
  )

  return {
    selected,
    isSelected,
    toggleSelect,
    select,
    selectAll,
    someSelected,
    allSelected,
    showSelectAll,
  }
}
