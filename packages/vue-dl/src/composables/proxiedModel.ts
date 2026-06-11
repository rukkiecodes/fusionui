import { computed, ref } from 'vue'
import type { WritableComputedRef } from 'vue'
import { getCurrentInstance } from '../util/getCurrentInstance'
import { toKebabCase } from '../util/helpers'

/**
 * Two-way binding helper. When the parent binds the model (`v-model` / explicit
 * prop) it stays controlled; otherwise it falls back to internal state so the
 * component still works uncontrolled.
 */
export function useProxiedModel<
  Props extends Record<string, unknown>,
  Prop extends Extract<keyof Props, string>,
  Inner = Props[Prop],
>(
  props: Props,
  prop: Prop,
  defaultValue?: Props[Prop],
  transformIn: (value?: Props[Prop]) => Inner = v => v as unknown as Inner,
  transformOut: (value: Inner) => Props[Prop] = v => v as unknown as Props[Prop]
): WritableComputedRef<Inner> {
  const vm = getCurrentInstance('useProxiedModel')
  const internal = ref(transformIn(props[prop] !== undefined ? props[prop] : defaultValue)) as {
    value: Inner
  }

  const isControlled = computed(() => {
    const vnodeProps = vm.vnode.props ?? {}
    return (
      (prop in vnodeProps || toKebabCase(prop) in vnodeProps) &&
      (`onUpdate:${prop}` in vnodeProps || `onUpdate:${toKebabCase(prop)}` in vnodeProps)
    )
  })

  return computed<Inner>({
    get(): Inner {
      if (isControlled.value) {
        return transformIn(props[prop])
      }
      return internal.value
    },
    set(value: Inner) {
      internal.value = value
      vm.emit(`update:${prop}`, transformOut(value))
    },
  })
}
