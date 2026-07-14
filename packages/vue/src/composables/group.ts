import { computed, inject, onBeforeUnmount, onMounted, provide, reactive, toRef } from 'vue'
import type { ComputedRef, InjectionKey, PropType, Ref } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { getUid } from '../util/helpers'
import { useProxiedModel } from './proxiedModel'

export interface GroupItem {
  id: number
  value: () => unknown
  disabled: () => boolean | undefined
}

export interface GroupProvide {
  register: (item: GroupItem) => void
  unregister: (id: number) => void
  select: (id: number, value: boolean) => void
  selected: ComputedRef<unknown[]>
  isSelected: (id: number) => boolean
  items: ComputedRef<{ id: number; value: unknown }[]>
  /** Class the group asks its selected items to wear (e.g. `fui-chip--selected`). */
  selectedClass: Ref<string | undefined>
}

export interface GroupItemProvide {
  id: number
  isSelected: ComputedRef<boolean>
  toggle: () => void
  select: (value: boolean) => void
  /** The group's `selectedClass` plus the item's own, or `[]` when unselected. */
  selectedClass: ComputedRef<string[]>
}

export const makeGroupProps = propsFactory(
  {
    modelValue: {
      type: null as unknown as PropType<unknown>,
      default: undefined,
    },
    multiple: Boolean,
    mandatory: [Boolean, String] as PropType<boolean | 'force'>,
    max: Number,
    selectedClass: String as PropType<string>,
  },
  'group'
)

export const makeGroupItemProps = propsFactory(
  {
    value: null,
    disabled: Boolean,
    selectedClass: String as PropType<string>,
  },
  'group-item'
)

interface GroupProps {
  modelValue?: unknown
  multiple?: boolean
  mandatory?: boolean | 'force'
  max?: number
  selectedClass?: string
}

/** Provides selection state to descendant group items (button groups, tabs). */
export function useGroup(props: GroupProps, injectKey: InjectionKey<GroupProvide>): GroupProvide {
  const items = reactive<GroupItem[]>([])
  const selected = useProxiedModel<Record<string, unknown>, 'modelValue', unknown[]>(
    props as Record<string, unknown>,
    'modelValue',
    [],
    v => (v == null ? [] : wrapInArray(v)),
    v => (props.multiple ? v : v[0])
  )
  let isUnmounted = false

  function getValue(item: GroupItem, index: number): unknown {
    const value = item.value()
    return value != null ? value : index
  }

  /** `mandatory: 'force'` guarantees a selection even before the user picks one. */
  function forceMandatoryValue(): void {
    if (props.mandatory !== 'force' || selected.value.length) return
    const index = items.findIndex(i => !i.disabled())
    if (index > -1) selected.value = [getValue(items[index], index)]
  }

  function register(item: GroupItem): void {
    items.push(item)
    forceMandatoryValue()
  }

  function unregister(id: number): void {
    if (isUnmounted) return
    const index = items.findIndex(i => i.id === id)
    if (index > -1) items.splice(index, 1)
    forceMandatoryValue()
  }

  function select(id: number, value: boolean): void {
    const item = items.find(i => i.id === id)
    if (!item || item.disabled()) return
    const itemValue = getValue(item, items.indexOf(item))

    if (props.multiple) {
      const next = selected.value.slice()
      const index = next.indexOf(itemValue)
      const isSelected = index > -1

      // A mandatory group always keeps at least one item selected, and `max`
      // caps how many can be added.
      if (isSelected && !value && props.mandatory && next.length <= 1) return
      if (!isSelected && value && props.max != null && next.length + 1 > props.max) return

      if (value && !isSelected) next.push(itemValue)
      else if (!value && isSelected) next.splice(index, 1)

      selected.value = next
    } else {
      const isSelected = selected.value.includes(itemValue)
      if (isSelected && !value && props.mandatory) return
      selected.value = value ? [itemValue] : []
    }
  }

  onBeforeUnmount(() => {
    isUnmounted = true
  })

  const provided: GroupProvide = {
    register,
    unregister,
    select,
    selected: computed(() => selected.value),
    isSelected: (id: number) => {
      const item = items.find(i => i.id === id)
      if (!item) return false
      return selected.value.includes(getValue(item, items.indexOf(item)))
    },
    items: computed(() =>
      items.map((item, index) => ({ id: item.id, value: getValue(item, index) }))
    ),
    selectedClass: toRef(() => props.selectedClass),
  }

  provide(injectKey, provided)
  return provided
}

interface GroupItemProps {
  value?: unknown
  disabled?: boolean
  selectedClass?: string
}

/** Registers a single item into the nearest group. */
export function useGroupItem(
  props: GroupItemProps,
  injectKey: InjectionKey<GroupProvide>
): GroupItemProvide | null {
  const group = inject(injectKey, null)
  if (!group) return null

  const id = getUid()
  const item: GroupItem = {
    id,
    value: () => props.value,
    disabled: () => props.disabled,
  }

  onMounted(() => group.register(item))
  onBeforeUnmount(() => group.unregister(id))

  const isSelected = computed(() => group.isSelected(id))

  return {
    id,
    isSelected,
    toggle: () => group.select(id, !isSelected.value),
    select: (value: boolean) => group.select(id, value),
    selectedClass: computed(() =>
      isSelected.value
        ? ([group.selectedClass.value, props.selectedClass].filter(Boolean) as string[])
        : []
    ),
  }
}

function wrapInArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
