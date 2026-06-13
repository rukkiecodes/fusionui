import { defineComponent as vueDefineComponent } from 'vue'
import type { DefineComponent, SetupContext, VNodeChild } from 'vue'
import { useDefaults } from '../composables/defaults'
import { getCurrentInstance } from './getCurrentInstance'

type ComponentOptionsLike = Record<string, any>

/**
 * Wraps Vue's `defineComponent` so every Vue DL component automatically applies
 * the hierarchical defaults system (global / per-component / `VdDefaultsProvider`)
 * before its own setup runs.
 */
export function defineComponent<T extends ComponentOptionsLike>(options: T): DefineComponent {
  const opts = options as Record<string, any>
  if (typeof opts.setup === 'function') {
    const setup = opts.setup
    const name = opts.name
    opts.setup = function (props: Record<string, any>, ctx: SetupContext) {
      const internalProps = useDefaults(props, name)
      return setup(internalProps, ctx)
    }
  }
  return vueDefineComponent(options) as unknown as DefineComponent
}

/**
 * Identity helper that lets a component declare its slot contract via a type
 * parameter while still flowing through `defineComponent`:
 *
 * ```ts
 * export const VdBtn = genericComponent<VdBtnSlots>()({ name: 'VdBtn', ... })
 * ```
 */
export function genericComponent<Slots = Record<string, any>>() {
  void 0 as unknown as Slots // phantom: keeps the generic meaningful to callers
  return <T extends ComponentOptionsLike>(options: T): DefineComponent => defineComponent(options)
}

/** Assigns a render function to the current instance (TSX components). */
export function useRender(render: () => VNodeChild): void {
  const vm = getCurrentInstance('useRender') as unknown as { render: () => VNodeChild }
  vm.render = render
}
