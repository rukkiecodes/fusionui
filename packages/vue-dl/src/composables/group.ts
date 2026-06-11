import { computed, inject, onBeforeUnmount, onMounted, provide, reactive } from 'vue'
import type { ComputedRef, InjectionKey, PropType } from 'vue'
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
}

export interface GroupItemProvide {
  id: number
  isSelected: ComputedRef<boolean>
  toggle: () => void
  select: (value: boolean) => void
}

export const makeGroupProps = propsFactory(
  {
    modelValue: {
      type: null as unknown as PropType<unknown>,
      default: undefined,
    },
    multiple: Boolean,
    mandatory: [Boolean, String] as PropType<boolean | 'force'>,
  },
  'group'
)

export const makeGroupItemProps = propsFactory(
  {
    value: null,
    disabled: Boolean,
  },
  'group-item'
)

interface GroupProps {
  modelValue?: unknown
  multiple?: boolean
  mandatory?: boolean | 'force'
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

  function getValue(item: GroupItem, index: number): unknown {
    const value = item.value()
    return value != null ? value : index
  }

  function register(item: GroupItem): void {
    items.push(item)
  }

  function unregister(id: number): void {
    const index = items.findIndex(i => i.id === id)
    if (index > -1) items.splice(index, 1)
  }

  function select(id: number, value: boolean): void {
    const item = items.find(i => i.id === id)
    if (!item || item.disabled()) return
    const itemValue = getValue(item, items.indexOf(item))

    if (props.multiple) {
      const next = new Set(selected.value)
      if (value) next.add(itemValue)
      else next.delete(itemValue)
      selected.value = Array.from(next)
    } else {
      selected.value = value ? [itemValue] : []
    }
  }

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
  }

  provide(injectKey, provided)
  return provided
}

interface GroupItemProps {
  value?: unknown
  disabled?: boolean
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
  }
}

function wrapInArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
