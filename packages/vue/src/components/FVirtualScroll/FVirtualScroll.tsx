import { computed, h, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { getCurrentInstance } from '../../util/getCurrentInstance'
import { makeComponentProps } from '../../composables/component'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'
import { convertToUnit } from '../../util/helpers'

/**
 * FVirtualScroll — windowed rendering. Only the rows that intersect the
 * viewport (plus a pixel buffer) are ever in the DOM; the rest of the list is
 * represented by padding above and below, so the scrollbar still reflects the
 * full data set.
 *
 * Two paths:
 *   • fixed height  — `item-height` given: offsets are arithmetic, nothing is
 *     ever measured. This is the fast path; use it whenever rows are uniform.
 *   • dynamic       — no `item-height`: rows are measured after they render and
 *     their sizes feed a prefix-sum index. Unmeasured rows fall back to
 *     `estimated-item-height`, so the scrollbar is right from the first frame.
 *
 * SSR: the first slice is computed from `height` alone (no DOM), so the server
 * emits a real, usable list; measurement only ever happens in `onMounted`.
 */

/** Item roles implied by the container role, so a windowed list still reads correctly. */
const ITEM_ROLES: Record<string, string> = {
  list: 'listitem',
  listbox: 'option',
  menu: 'menuitem',
  tree: 'treeitem',
  grid: 'row',
  table: 'row',
}

const DEFAULT_VIEWPORT = 300

export type FVirtualScrollItemKey = string | ((item: any, index: number) => PropertyKey)

export interface FVirtualScrollSlot {
  item: any
  index: number
  /** Renderless only: bind to the row element so it can be measured. */
  itemRef?: (el: unknown) => void
}

export const makeFVirtualScrollProps = propsFactory(
  {
    items: { type: Array as PropType<readonly unknown[]>, default: () => [] },
    /** Fixed row height. Given it, nothing is measured — the fast path. */
    itemHeight: [Number, String] as PropType<number | string>,
    /** Row height assumed before a row has been measured (dynamic path). */
    estimatedItemHeight: { type: [Number, String] as PropType<number | string>, default: 48 },
    /** Key for each row: a property name, or a function of (item, index). */
    itemKey: [String, Function] as PropType<FVirtualScrollItemKey>,
    /** Extra pixels rendered above and below the viewport. */
    buffer: { type: [Number, String] as PropType<number | string>, default: 100 },
    /** Render rows straight into the parent and window against the nearest scroll parent. */
    renderless: Boolean,
    /** Container role. `''` opts out of list semantics entirely. */
    role: { type: String as PropType<string>, default: 'list' },
    /** Row role. Derived from `role` when omitted. */
    itemRole: String as PropType<string>,
    ...makeDimensionProps({ height: 300 }),
    ...makeComponentProps(),
  },
  'FVirtualScroll'
)

export const FVirtualScroll = genericComponent<{
  default: (props: FVirtualScrollSlot) => any
}>()({
  name: 'FVirtualScroll',
  props: makeFVirtualScrollProps(),
  setup(props: any, { slots }: any) {
    const vm = getCurrentInstance('FVirtualScroll')
    const { dimensionStyles } = useDimension(props)

    const containerRef = ref<HTMLElement | null>(null)
    const markerRef = ref<HTMLElement | null>(null)

    const fixedHeight = computed(() => toPx(props.itemHeight))
    const estimate = computed(() => toPx(props.estimatedItemHeight) || 48)
    const buffer = computed(() => toPx(props.buffer))

    /** Measured row heights (dynamic path only), and their prefix sums. */
    let sizes: number[] = []
    let offsets: number[] = [0]
    /** Distance from the top of the scroll content to the top of the list. */
    let markerOffset = 0

    // Seeded from `height` so the server renders a sensible first slice.
    const viewportHeight = shallowRef(toPx(props.height) || DEFAULT_VIEWPORT)
    const scrollPos = shallowRef(0)

    const first = shallowRef(0)
    const last = shallowRef(0)
    const paddingTop = shallowRef(0)
    const paddingBottom = shallowRef(0)

    const itemRole = computed(
      () => props.itemRole ?? (props.role ? ITEM_ROLES[props.role] : undefined)
    )

    function rebuildOffsets(): void {
      if (fixedHeight.value) return
      const n = props.items.length
      offsets = new Array(n + 1)
      offsets[0] = 0
      for (let i = 0; i < n; i++) offsets[i + 1] = offsets[i] + (sizes[i] || estimate.value)
    }

    function offsetAt(index: number): number {
      const n = props.items.length
      const i = Math.max(0, Math.min(n, index))
      if (fixedHeight.value) return i * fixedHeight.value
      return offsets[i] ?? 0
    }

    /** Index of the row occupying `px` (binary search on the dynamic path). */
    function indexAt(px: number): number {
      const n = props.items.length
      if (n <= 0) return 0
      if (fixedHeight.value) {
        return Math.max(0, Math.min(n - 1, Math.floor(px / fixedHeight.value)))
      }
      let lo = 0
      let hi = n
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if ((offsets[mid + 1] ?? 0) <= px) lo = mid + 1
        else hi = mid
      }
      return Math.min(lo, n - 1)
    }

    /** Pure — no DOM reads — so it runs identically on the server. */
    function calculate(): void {
      const n = props.items.length
      if (!n) {
        first.value = 0
        last.value = 0
        paddingTop.value = 0
        paddingBottom.value = 0
        return
      }
      const startPx = Math.max(0, scrollPos.value - buffer.value)
      const endPx = scrollPos.value + viewportHeight.value + buffer.value
      const start = indexAt(startPx)
      const end = Math.max(start + 1, Math.min(n, indexAt(endPx) + 1))

      first.value = start
      last.value = end
      paddingTop.value = offsetAt(start)
      paddingBottom.value = Math.max(0, offsetAt(n) - offsetAt(end))
    }

    rebuildOffsets()
    calculate()

    const computedItems = computed(() =>
      props.items.slice(first.value, last.value).map((raw: unknown, i: number) => {
        const index = first.value + i
        return { raw, index, key: keyOf(raw, index) }
      })
    )

    function keyOf(item: any, index: number): PropertyKey {
      const key = props.itemKey
      if (typeof key === 'function') return key(item, index)
      if (typeof key === 'string' && item && typeof item === 'object') {
        return (item as Record<string, PropertyKey>)[key] ?? index
      }
      return index
    }

    watch(
      () => props.items,
      () => {
        sizes = []
        rebuildOffsets()
        readScroll()
        calculate()
      }
    )
    watch([fixedHeight, estimate], () => {
      rebuildOffsets()
      calculate()
    })

    // ---- DOM (client only) --------------------------------------------------

    const itemEls = new Map<number, HTMLElement>()

    function setItemRef(index: number) {
      return (el: unknown) => {
        const node = (el as { $el?: unknown })?.$el ?? el
        if (node && (node as HTMLElement).nodeType === 1) {
          itemEls.set(index, node as HTMLElement)
        }
      }
    }

    /** Dynamic path: fold freshly rendered row heights back into the index. */
    function measureItems(): void {
      if (fixedHeight.value || typeof window === 'undefined') return
      let changed = false
      for (const [index, el] of itemEls) {
        if (!el.isConnected) {
          itemEls.delete(index)
          continue
        }
        const height = el.offsetHeight
        if (height > 0 && sizes[index] !== height) {
          sizes[index] = height
          changed = true
        }
      }
      if (!changed) return
      rebuildOffsets()
      calculate()
    }

    function isDocumentScroller(el: HTMLElement): boolean {
      return el === document.documentElement || el === document.body
    }

    function readScroll(): void {
      const el = containerRef.value
      if (!el || typeof window === 'undefined') return
      scrollPos.value = Math.max(0, el.scrollTop - markerOffset)
    }

    function measureViewport(): void {
      const el = containerRef.value
      if (!el || typeof window === 'undefined') return
      viewportHeight.value = isDocumentScroller(el)
        ? window.innerHeight
        : el.clientHeight || viewportHeight.value

      const marker = markerRef.value
      if (!marker) {
        markerOffset = 0
        return
      }
      const markerTop = marker.getBoundingClientRect().top
      // Distance from the top of the scrolled content to the top of the list.
      markerOffset = isDocumentScroller(el)
        ? Math.max(0, markerTop + el.scrollTop)
        : Math.max(0, markerTop - el.getBoundingClientRect().top + el.scrollTop)
    }

    let frame = -1
    function schedule(): void {
      if (typeof window === 'undefined') return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        readScroll()
        calculate()
      })
    }

    /** Nearest ancestor that actually scrolls; falls back to the document. */
    function getScrollParent(node: Node | null): HTMLElement {
      let el: any = node
      while (el) {
        if (el.nodeType === 1 && hasScrollbar(el as HTMLElement)) return el as HTMLElement
        el = el.parentElement ?? el.parentNode
      }
      return (document.scrollingElement as HTMLElement) ?? document.documentElement
    }

    function hasScrollbar(el: HTMLElement): boolean {
      const style = window.getComputedStyle(el)
      return /(auto|scroll|overlay)/.test(style.overflowY) && el.scrollHeight > el.clientHeight
    }

    let scrollTarget: HTMLElement | Document | null = null
    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
      if (props.renderless) {
        containerRef.value = getScrollParent(vm.vnode.el as Node)
      }
      const el = containerRef.value
      if (!el) return

      scrollTarget = isDocumentScroller(el) ? document : el
      scrollTarget.addEventListener('scroll', schedule, { passive: true })

      if (isDocumentScroller(el)) {
        window.addEventListener('resize', onResize, { passive: true })
      } else if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(onResize)
        resizeObserver.observe(el)
        if (markerRef.value && !props.renderless) resizeObserver.observe(markerRef.value)
      }

      measureViewport()
      measureItems()
      readScroll()
      calculate()
    })

    function onResize(): void {
      measureViewport()
      measureItems()
      calculate()
    }

    onUpdated(measureItems)

    onBeforeUnmount(() => {
      if (typeof window === 'undefined') return
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      scrollTarget?.removeEventListener('scroll', schedule)
      resizeObserver?.disconnect()
      itemEls.clear()
    })

    /** Scroll a row into view (public: `ref.scrollToIndex(i)`). */
    function scrollToIndex(index: number): void {
      const el = containerRef.value
      if (!el) return
      el.scrollTop = offsetAt(index) + markerOffset
      readScroll()
      calculate()
    }

    useRender(() => {
      const total = props.items.length
      const rows = computedItems.value.map(({ raw, index, key }: any) => {
        if (props.renderless) {
          return slots.default?.({ item: raw, index, itemRef: setItemRef(index) })
        }
        return h(
          'div',
          {
            key,
            ref: setItemRef(index),
            class: 'fui-virtual-scroll__item',
            role: itemRole.value,
            'aria-setsize': itemRole.value ? total : undefined,
            'aria-posinset': itemRole.value ? index + 1 : undefined,
          },
          slots.default?.({ item: raw, index })
        )
      })

      if (props.renderless) {
        return [
          h('div', {
            key: 'spacer-top',
            ref: markerRef,
            class: 'fui-virtual-scroll__spacer',
            'aria-hidden': 'true',
            style: { paddingTop: convertToUnit(paddingTop.value) },
          }),
          ...rows,
          h('div', {
            key: 'spacer-bottom',
            class: 'fui-virtual-scroll__spacer',
            'aria-hidden': 'true',
            style: { paddingBottom: convertToUnit(paddingBottom.value) },
          }),
        ]
      }

      return h(
        'div',
        {
          ref: containerRef,
          class: ['fui-virtual-scroll', props.class],
          style: [dimensionStyles.value, props.style],
          // A scrollable region must be reachable and operable by keyboard.
          tabindex: 0,
          role: props.role || undefined,
        },
        [
          h(
            'div',
            {
              ref: markerRef,
              // Transparent to AT so rows stay owned by the container's role.
              role: 'presentation',
              class: 'fui-virtual-scroll__container',
              style: {
                paddingTop: convertToUnit(paddingTop.value),
                paddingBottom: convertToUnit(paddingBottom.value),
              },
            },
            rows
          ),
        ]
      )
    })

    return { scrollToIndex, calculateVisibleItems: calculate }
  },
})

function toPx(value: unknown): number {
  const n = parseFloat(String(value ?? ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}

export type FVirtualScroll = InstanceType<typeof FVirtualScroll>
