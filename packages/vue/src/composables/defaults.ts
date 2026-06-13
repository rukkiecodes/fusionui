import { inject, provide, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import { getCurrentInstance } from '../util/getCurrentInstance'
import { mergeDeep } from '../util/helpers'

export type DefaultsInstance = Record<string, Record<string, unknown> | undefined> & {
  global?: Record<string, unknown>
}

export const DefaultsSymbol: InjectionKey<Ref<DefaultsInstance>> = Symbol.for('vuedl:defaults')

export function createDefaults(options?: DefaultsInstance): Ref<DefaultsInstance> {
  return ref(options ?? {})
}

export function injectDefaults(): Ref<DefaultsInstance> {
  const defaults = inject(DefaultsSymbol)
  if (!defaults) throw new Error('[Vue DL] Could not find defaults instance')
  return defaults
}

/**
 * Scoped override of defaults (powers `<VdDefaultsProvider>`). Merges the new
 * defaults over whatever is currently provided.
 */
export function provideDefaults(defaults?: DefaultsInstance): Ref<DefaultsInstance> {
  const injected = injectDefaults()
  const merged = ref(
    defaults ? (mergeDeep(injected.value, defaults) as DefaultsInstance) : injected.value
  )
  provide(DefaultsSymbol, merged)
  return merged
}

/**
 * Returns a reactive view of `props` where any value the consumer did NOT
 * explicitly set falls back to the provided per-component / global default.
 */
export function useDefaults<T extends Record<string, unknown>>(props: T, name?: string): T {
  const vm = getCurrentInstance('useDefaults')
  const componentName = name ?? (vm.type as { name?: string }).name
  const defaults = inject(DefaultsSymbol, null)

  if (!defaults || !componentName) return props

  return new Proxy(props, {
    get(target, prop: string) {
      const value = Reflect.get(target, prop)
      const explicitlySet =
        vm.vnode.props != null && (prop in vm.vnode.props || toKebab(prop) in vm.vnode.props)
      if (explicitlySet) return value

      const scoped = defaults.value[componentName]
      const fallback = scoped?.[prop] ?? defaults.value.global?.[prop]
      return fallback !== undefined ? fallback : value
    },
  }) as T
}

function toKebab(str: string): string {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
