import { getCurrentInstance as _getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'

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

/** Best-effort component name for the current instance (used to scope BEM classes). */
export function getCurrentInstanceName(name = 'composables'): string {
  const vm = _getCurrentInstance()?.type as VueDLInstanceType | undefined
  return vm?.aliasName ?? vm?.name ?? name
}
