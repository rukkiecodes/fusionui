import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { convertToUnit } from '../../util/helpers'
import { FBtn } from '../FBtn'
import { FProgressCircular } from '../FProgress'

/**
 * FInfiniteScroll — asks for more rows as the user approaches an edge.
 *
 * A sentinel sits just past each active edge; an IntersectionObserver rooted on
 * the scroller reports when it comes into range and the component emits `load`
 * with `{ side, done }`. The consumer calls `done('ok' | 'empty' | 'error' |
 * 'loading')` when the fetch settles, which is what unlatches the next request.
 *
 * `mode="manual"` swaps the sentinel for a Load more button. That button is also
 * the fallback whenever IntersectionObserver is unavailable, so the component
 * never becomes a dead end for a browser (or a user) that can't trigger an
 * intersection.
 */

export type FInfiniteScrollSide = 'start' | 'end' | 'both'
export type FInfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'

export interface FInfiniteScrollLoadOptions {
  side: FInfiniteScrollSide
  done: (status: FInfiniteScrollStatus) => void
}

export const makeFInfiniteScrollProps = propsFactory(
  {
    /** Which edge(s) load more. */
    side: {
      type: String as PropType<FInfiniteScrollSide>,
      default: 'end',
      validator: (v: unknown) => ['start', 'end', 'both'].includes(v as string),
    },
    /** `intersect` loads on approach; `manual` waits for the Load more button. */
    mode: {
      type: String as PropType<'intersect' | 'manual'>,
      default: 'intersect',
      validator: (v: unknown) => ['intersect', 'manual'].includes(v as string),
    },
    direction: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical',
      validator: (v: unknown) => ['vertical', 'horizontal'].includes(v as string),
    },
    /** How far before the edge to start loading (any CSS length). */
    margin: [Number, String] as PropType<number | string>,
    color: { type: String as PropType<string>, default: 'primary' },
    loadMoreText: { type: String as PropType<string>, default: 'Load more' },
    emptyText: { type: String as PropType<string>, default: 'No more items' },
    /** Announced (and used as the spinner's accessible name) while loading. */
    loadingText: { type: String as PropType<string>, default: 'Loading more items' },
    errorText: { type: String as PropType<string>, default: 'Something went wrong' },
    retryText: { type: String as PropType<string>, default: 'Retry' },
    ...makeDimensionProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FInfiniteScroll'
)

export const FInfiniteScroll = genericComponent()({
  name: 'FInfiniteScroll',
  props: makeFInfiniteScrollProps(),
  emits: {
    load: (_options: FInfiniteScrollLoadOptions) => true,
  },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)
    const { dimensionStyles } = useDimension(props)

    const rootEl = ref<HTMLElement | null>(null)
    const startSentinel = ref<HTMLElement | null>(null)
    const endSentinel = ref<HTMLElement | null>(null)

    const startStatus = shallowRef<FInfiniteScrollStatus>('ok')
    const endStatus = shallowRef<FInfiniteScrollStatus>('ok')
    const intersecting: Record<string, boolean> = { start: false, end: false }

    // Assume support during SSR + hydration; corrected on mount so the markup
    // the server produced and the markup the client hydrates always match.
    const observerSupported = shallowRef(true)

    const hasStart = computed(() => props.side === 'start' || props.side === 'both')
    const hasEnd = computed(() => props.side === 'end' || props.side === 'both')
    /** The button is the fallback whenever we cannot observe intersections. */
    const effectiveMode = computed(() =>
      props.mode === 'intersect' && observerSupported.value ? 'intersect' : 'manual'
    )
    const rootMargin = computed(() => convertToUnit(props.margin) ?? '0px')

    function statusOf(side: FInfiniteScrollSide): FInfiniteScrollStatus {
      return side === 'start' ? startStatus.value : endStatus.value
    }

    function setStatus(side: FInfiniteScrollSide, status: FInfiniteScrollStatus): void {
      if (side === 'start' || side === 'both') startStatus.value = status
      if (side === 'end' || side === 'both') endStatus.value = status
    }

    // ---- scroll geometry ----------------------------------------------------

    const vertical = computed(() => props.direction === 'vertical')

    function scrollAmount(): number {
      const el = rootEl.value
      if (!el) return 0
      return vertical.value ? el.scrollTop : el.scrollLeft
    }
    function setScrollAmount(value: number): void {
      const el = rootEl.value
      if (!el) return
      if (vertical.value) el.scrollTop = value
      else el.scrollLeft = value
    }
    function scrollSize(): number {
      const el = rootEl.value
      if (!el) return 0
      return vertical.value ? el.scrollHeight : el.scrollWidth
    }
    function containerSize(): number {
      const el = rootEl.value
      if (!el) return 0
      return vertical.value ? el.clientHeight : el.clientWidth
    }

    // ---- loading ------------------------------------------------------------

    let previousScrollSize = 0

    function requestLoad(side: FInfiniteScrollSide): void {
      const status = statusOf(side)
      if (status === 'empty' || status === 'loading') return
      if (effectiveMode.value === 'intersect' && !intersecting[side]) return

      previousScrollSize = scrollSize()
      setStatus(side, 'loading')

      let settled = false
      const done = (result: FInfiniteScrollStatus): void => {
        if (settled) return
        settled = true
        setStatus(side, result)

        void nextTick(() => {
          if (result === 'empty' || result === 'error' || result === 'loading') return

          // Prepending at the start would otherwise yank the viewport upward.
          if (side === 'start') {
            setScrollAmount(scrollSize() - previousScrollSize + scrollAmount())
          }
          if (effectiveMode.value === 'intersect') retryIfStillInRange(side)
        })
      }

      emit('load', { side, done })
    }

    /**
     * The observer only fires on a *change* of intersection, so a batch that
     * doesn't fill the viewport would leave the sentinel visible and silent.
     * Re-ask once the browser has settled the new layout.
     */
    function retryIfStillInRange(side: FInfiniteScrollSide): void {
      if (typeof window === 'undefined') return
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (intersecting[side]) requestLoad(side)
        })
      })
    }

    // ---- intersection observers --------------------------------------------

    let observers: IntersectionObserver[] = []

    function teardownObservers(): void {
      observers.forEach(o => o.disconnect())
      observers = []
    }

    function observe(el: HTMLElement | null, side: FInfiniteScrollSide): void {
      if (!el || !rootEl.value) return
      const observer = new IntersectionObserver(
        entries => {
          const hit = entries.some(e => e.isIntersecting)
          intersecting[side] = hit
          if (hit) requestLoad(side)
        },
        { root: rootEl.value, rootMargin: rootMargin.value }
      )
      observer.observe(el)
      observers.push(observer)
    }

    function setupObservers(): void {
      teardownObservers()
      if (!observerSupported.value || effectiveMode.value !== 'intersect') return
      if (hasStart.value) observe(startSentinel.value, 'start')
      if (hasEnd.value) observe(endSentinel.value, 'end')
    }

    onMounted(() => {
      observerSupported.value = typeof IntersectionObserver !== 'undefined'

      // `start` loads upward, so begin at the far edge; `both` begins centered.
      if (props.side === 'start') setScrollAmount(scrollSize())
      else if (props.side === 'both') setScrollAmount(scrollSize() / 2 - containerSize() / 2)

      void nextTick(setupObservers)
    })

    watch([() => props.side, () => props.mode, () => props.margin, () => props.direction], () => {
      intersecting.start = false
      intersecting.end = false
      void nextTick(setupObservers)
    })

    onBeforeUnmount(teardownObservers)

    /** Re-arm a side that reported `empty` or `error` (public: `ref.reset()`). */
    function reset(side?: FInfiniteScrollSide): void {
      const target = side ?? props.side
      setStatus(target, 'ok')
      void nextTick(() => {
        if (effectiveMode.value !== 'intersect') return
        if (target === 'both') {
          retryIfStillInRange('start')
          retryIfStillInRange('end')
        } else {
          retryIfStillInRange(target)
        }
      })
    }

    // ---- rendering ----------------------------------------------------------

    function renderSide(side: FInfiniteScrollSide): any {
      if (side === 'start' && !hasStart.value) return null
      if (side === 'end' && !hasEnd.value) return null

      const status = statusOf(side)
      const onClick = (): void => {
        intersecting[side] = true
        requestLoad(side)
      }
      const slotProps = { side, status, props: { onClick, color: props.color } }

      let content: any = null

      if (status === 'error') {
        content = slots.error?.(slotProps) ?? [
          h('span', { class: 'fui-infinite-scroll__message' }, props.errorText),
          h(
            FBtn,
            { variant: 'text', color: 'danger', size: 'small', onClick },
            { default: () => props.retryText }
          ),
        ]
      } else if (status === 'empty') {
        content = slots.empty?.(slotProps) ?? [
          h('span', { class: 'fui-infinite-scroll__message' }, props.emptyText),
        ]
      } else if (status === 'loading') {
        content = slots.loading?.(slotProps) ?? [
          h(FProgressCircular, {
            indeterminate: true,
            color: props.color,
            size: 24,
            'aria-label': props.loadingText,
          }),
        ]
      } else if (effectiveMode.value === 'manual') {
        content = slots['load-more']?.(slotProps) ?? [
          h(
            FBtn,
            { variant: 'outlined', color: props.color, size: 'small', onClick },
            { default: () => props.loadMoreText }
          ),
        ]
      } else {
        // Intersect mode idles on a spinner: a load is imminent by definition.
        content = slots.loading?.(slotProps) ?? [
          h(FProgressCircular, {
            indeterminate: true,
            color: props.color,
            size: 24,
            'aria-label': props.loadingText,
          }),
        ]
      }

      return h(
        'div',
        {
          key: side,
          class: ['fui-infinite-scroll__side', `fui-infinite-scroll__side--${side}`],
          // Status changes (loading → empty → error) are announced, not silent.
          role: 'status',
          'aria-live': 'polite',
        },
        content
      )
    }

    function renderSentinel(side: FInfiniteScrollSide, ref_: any): any {
      return h('div', {
        key: `sentinel-${side}`,
        ref: ref_,
        class: 'fui-infinite-scroll__sentinel',
        'aria-hidden': 'true',
      })
    }

    useRender(() => {
      const intersect = effectiveMode.value === 'intersect'

      return h(
        props.tag,
        {
          ref: rootEl,
          class: ['fui-infinite-scroll', `fui-infinite-scroll--${props.direction}`, props.class],
          style: [dimensionStyles.value, props.style],
        },
        [
          renderSide('start'),
          hasStart.value && intersect ? renderSentinel('start', startSentinel) : null,
          slots.default?.(),
          hasEnd.value && intersect ? renderSentinel('end', endSentinel) : null,
          renderSide('end'),
        ]
      )
    })

    return { reset }
  },
})

export type FInfiniteScroll = InstanceType<typeof FInfiniteScroll>
