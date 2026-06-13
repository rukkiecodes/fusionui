import { getCurrentInstance as _getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { toKebabCase } from './helpers'

interface FusionUIInstanceType {
  name?: string
  aliasName?: string
}

/** Like Vue's getCurrentInstance but throws a helpful error when called outside setup. */
export function getCurrentInstance(name: string, message?: string): ComponentInternalInstance {
  const vm = _getCurrentInstance()
  if (!vm) {
    throw new Error(
      `[FusionUI] ${name} ${message ?? 'must be called from inside a setup function'}`
    )
  }
  return vm
}

/**
 * Best-effort kebab-case component name for the current instance, used to scope
 * BEM classes (e.g. `FBtn` → `fui-btn`) so composable-generated classes
 * (`fui-btn--size-large`) match the component stylesheets.
 */
export function getCurrentInstanceName(name = 'composables'): string {
  const vm = _getCurrentInstance()?.type as FusionUIInstanceType | undefined
  const raw = vm?.aliasName ?? vm?.name ?? name
  // The `F` component prefix maps to the `fui-` class namespace (`FBtn` → `fui-btn`),
  // never to a literal `f-` class.
  return /^F[A-Z]/.test(raw) ? `fui-${toKebabCase(raw.slice(1))}` : toKebabCase(raw)
}
