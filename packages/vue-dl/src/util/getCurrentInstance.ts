import { getCurrentInstance as _getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { toKebabCase } from './helpers'

interface VueDLInstanceType {
  name?: string
  aliasName?: string
}

/** Like Vue's getCurrentInstance but throws a helpful error when called outside setup. */
export function getCurrentInstance(name: string, message?: string): ComponentInternalInstance {
  const vm = _getCurrentInstance()
  if (!vm) {
    throw new Error(`[Vue DL] ${name} ${message ?? 'must be called from inside a setup function'}`)
  }
  return vm
}

/**
 * Best-effort kebab-case component name for the current instance, used to scope
 * BEM classes (e.g. `VdBtn` → `vd-btn`) so composable-generated classes
 * (`vd-btn--size-large`) match the component stylesheets.
 */
export function getCurrentInstanceName(name = 'composables'): string {
  const vm = _getCurrentInstance()?.type as VueDLInstanceType | undefined
  return toKebabCase(vm?.aliasName ?? vm?.name ?? name)
}
