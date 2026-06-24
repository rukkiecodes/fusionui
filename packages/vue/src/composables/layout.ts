import { computed, inject, onBeforeUnmount, provide, ref } from 'vue'
import type { ComputedRef, CSSProperties, InjectionKey, Ref } from 'vue'

/**
 * Layout system — a small port of Vuetify's `createLayout`. Layout items
 * (app bar, navigation drawer) register their side + size + order; the provider
 * accumulates them into per-side offsets so `<f-main>` insets itself and each
 * item is positioned (fixed) in the leftover space. Drop the bars into an
 * `<f-layout>` and they self-organize.
 */

export type LayoutPosition = 'top' | 'bottom' | 'left' | 'right'

interface LayoutItemOptions {
  id: string
  position: Ref<LayoutPosition>
  /** Size in px along the item's axis (width for left/right, height for top/bottom). */
  size: Ref<number>
  /** Lower order = accumulated first = "outer". Navbar is 0; sidebar defaults to 1. */
  order: Ref<number>
  /** Whether the item currently takes layout space (false ⇒ slides off-screen). */
  active: Ref<boolean>
  /** Island margin (px) inset on every side; also widens the slot it reserves. */
  margin?: Ref<number>
}

interface Offsets {
  top: number
  bottom: number
  left: number
  right: number
}

interface LayoutProvide {
  register: (opts: LayoutItemOptions) => {
    layoutItemStyles: ComputedRef<CSSProperties>
    zIndex: ComputedRef<number>
  }
  unregister: (id: string) => void
  mainStyles: ComputedRef<CSSProperties>
}

export const FLayoutKey: InjectionKey<LayoutProvide> = Symbol.for('fusionui:layout')

const ZINDEX = 1000

const unit = (n: number) => `${n}px`
const isHorizontal = (p: LayoutPosition) => p === 'left' || p === 'right'

export function createLayout() {
  // Plain Map (NOT reactive) so the per-item Refs aren't unwrapped. Reactivity
  // comes from reading those Refs in the computeds + the reactive `order` list.
  const items = new Map<string, LayoutItemOptions>()
  const order = ref<string[]>([])

  // Sort by `order` asc; on ties, horizontal items (drawers) win over vertical
  // (bars) so an explicit `order=0` on the sidebar makes it full-height. Final
  // tie-break is registration (DOM) order.
  const sortedIds = computed(() => {
    return [...order.value].sort((a, b) => {
      const ia = items.get(a)
      const ib = items.get(b)
      if (!ia || !ib) return 0
      if (ia.order.value !== ib.order.value) return ia.order.value - ib.order.value
      const ha = isHorizontal(ia.position.value) ? 0 : 1
      const hb = isHorizontal(ib.position.value) ? 0 : 1
      if (ha !== hb) return ha - hb
      return order.value.indexOf(a) - order.value.indexOf(b)
    })
  })

  // Each item's offset layer = the accumulated offsets BEFORE it; then it adds
  // its own size to its side. The leftover after all items is the main offset.
  const layers = computed(() => {
    let acc: Offsets = { top: 0, bottom: 0, left: 0, right: 0 }
    const perItem = new Map<string, Offsets>()
    for (const id of sortedIds.value) {
      const it = items.get(id)
      if (!it) continue
      perItem.set(id, { ...acc })
      if (it.active.value) {
        // An island reserves its size plus a margin on each side.
        const slot = it.size.value + 2 * (it.margin?.value ?? 0)
        acc = { ...acc, [it.position.value]: acc[it.position.value] + slot }
      }
    }
    return { perItem, main: acc }
  })

  const mainStyles = computed<CSSProperties>(() => {
    const m = layers.value.main
    return {
      '--fui-layout-top': unit(m.top),
      '--fui-layout-right': unit(m.right),
      '--fui-layout-bottom': unit(m.bottom),
      '--fui-layout-left': unit(m.left),
    } as CSSProperties
  })

  function register(opts: LayoutItemOptions) {
    items.set(opts.id, opts)
    if (!order.value.includes(opts.id)) order.value.push(opts.id)

    // Lower `order` = higher stacking, so the navbar (order 0) always paints above
    // the drawer at their shared edge. Deterministic (not registration-timing
    // dependent), so SSR and client agree.
    const zIndex = computed(() => ZINDEX + Math.max(0, 20 - opts.order.value))

    const layoutItemStyles = computed<CSSProperties>(() => {
      const layer = layers.value.perItem.get(opts.id) ?? { top: 0, bottom: 0, left: 0, right: 0 }
      const pos = opts.position.value
      const horizontal = isHorizontal(pos)
      const size = opts.size.value
      const active = opts.active.value

      const m = opts.margin?.value ?? 0
      const axis = horizontal ? 'X' : 'Y'
      const sign = pos === 'right' || pos === 'bottom' ? 1 : -1
      const transform = active ? undefined : `translate${axis}(${sign * 110}%)`

      return {
        position: 'fixed',
        zIndex: zIndex.value,
        transform,
        // `+ m` insets an island off every edge.
        top: pos !== 'bottom' ? unit(layer.top + m) : undefined,
        bottom: pos !== 'top' ? unit(layer.bottom + m) : undefined,
        left: pos !== 'right' ? unit(layer.left + m) : undefined,
        right: pos !== 'left' ? unit(layer.right + m) : undefined,
        // Drawers (left/right) span the leftover height and take their prop width.
        // Bars (top/bottom) span the leftover width but keep their NATURAL height
        // (which is what gets measured and fed back as `size`).
        height: horizontal ? `calc(100% - ${layer.top + m}px - ${layer.bottom + m}px)` : undefined,
        width: horizontal ? unit(size) : `calc(100% - ${layer.left + m}px - ${layer.right + m}px)`,
      } as CSSProperties
    })

    return { layoutItemStyles, zIndex }
  }

  function unregister(id: string) {
    items.delete(id)
    order.value = order.value.filter(i => i !== id)
  }

  provide(FLayoutKey, { register, unregister, mainStyles })

  return { mainStyles }
}

/** Consumed by `<f-main>`: the accumulated inset of all active layout items. */
export function useLayout() {
  const layout = inject(FLayoutKey, null)
  return {
    hasLayout: !!layout,
    mainStyles: layout?.mainStyles ?? computed(() => ({}) as CSSProperties),
  }
}

/**
 * Register the current component as a layout item. No-op (returns hasLayout:false)
 * when used outside an `<f-layout>`, so bars stay usable standalone.
 */
export function useLayoutItem(opts: LayoutItemOptions) {
  const layout = inject(FLayoutKey, null)
  if (!layout) {
    return {
      hasLayout: false,
      layoutItemStyles: computed(() => ({}) as CSSProperties),
      zIndex: computed(() => ZINDEX),
    }
  }
  const { layoutItemStyles, zIndex } = layout.register(opts)
  onBeforeUnmount(() => layout.unregister(opts.id))
  return { hasLayout: true, layoutItemStyles, zIndex }
}
