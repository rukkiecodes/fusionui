import { computed, h, nextTick, onBeforeUnmount, onMounted, provide, ref, toRef, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeGroupProps, useGroup } from '../../composables/group'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'
import { FSlideGroupContextSymbol, FSlideGroupSymbol } from './key'

/** Breathing room left between a scrolled-to item and the viewport edge. */
const EDGE_GUTTER = 16

export const makeFSlideGroupProps = propsFactory(
  {
    /** `true` shows the arrows only while the strip overflows; `'always'` pins them. */
    showArrows: { type: [Boolean, String] as PropType<boolean | 'always'>, default: true },
    /** Keep the selected item centered in the viewport. */
    centerActive: Boolean,
    /** Scroll along the x-axis (default) or the y-axis. */
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    prevIcon: { type: [String, Object, Function] as PropType<IconValue>, default: '$prev' },
    nextIcon: { type: [String, Object, Function] as PropType<IconValue>, default: '$next' },
    ...makeGroupProps(),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSlideGroup'
)

/**
 * A scrollable, selectable strip of items — filter chips, a category rail, an
 * avatar row. It overflows sideways rather than wrapping, and grows arrows only
 * when there is something out of view.
 */
export const FSlideGroup = genericComponent()({
  name: 'FSlideGroup',
  props: makeFSlideGroupProps(),
  emits: { 'update:modelValue': (_v: unknown) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const group = useGroup(props, FSlideGroupSymbol)

    const containerRef = ref<HTMLElement | null>(null)
    const els = new Map<number, HTMLElement>()

    const isHorizontal = computed(() => props.direction !== 'vertical')

    // Measurements — zero until mounted, which keeps SSR output arrow-free.
    const containerSize = ref(0)
    const contentSize = ref(0)
    const scrollOffset = ref(0)
    /** Smooth scrolling is a motion effect: honour the OS preference. */
    const smooth = ref(true)

    const isOverflowing = computed(() => contentSize.value - containerSize.value > 1)
    const showArrows = computed(() => {
      if (props.showArrows === false) return false
      if (props.showArrows === 'always') return true
      return isOverflowing.value
    })
    const hasPrev = computed(() => isOverflowing.value && scrollOffset.value > 1)
    const hasNext = computed(
      () => isOverflowing.value && scrollOffset.value + containerSize.value < contentSize.value - 1
    )

    function measure(): void {
      const el = containerRef.value
      if (!el) return
      containerSize.value = isHorizontal.value ? el.clientWidth : el.clientHeight
      contentSize.value = isHorizontal.value ? el.scrollWidth : el.scrollHeight
      scrollOffset.value = isHorizontal.value ? el.scrollLeft : el.scrollTop
    }

    function scrollBy(delta: number): void {
      const el = containerRef.value
      if (!el) return
      const behavior = smooth.value ? 'smooth' : 'auto'
      el.scrollBy(isHorizontal.value ? { left: delta, behavior } : { top: delta, behavior })
    }

    /** Bring `el` into view — centered when `centerActive`, otherwise minimally. */
    function scrollToEl(el: HTMLElement, center: boolean): void {
      const container = containerRef.value
      if (!container) return

      const itemRect = el.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const horizontal = isHorizontal.value

      const current = horizontal ? container.scrollLeft : container.scrollTop
      const viewport = horizontal ? container.clientWidth : container.clientHeight
      const size = horizontal ? itemRect.width : itemRect.height
      // Offset of the item within the scrollable content.
      const start = horizontal
        ? itemRect.left - containerRect.left + current
        : itemRect.top - containerRect.top + current

      let target: number
      if (center) {
        target = start - (viewport - size) / 2
      } else if (start < current) {
        target = start - EDGE_GUTTER
      } else if (start + size > current + viewport) {
        target = start + size - viewport + EDGE_GUTTER
      } else {
        return
      }

      const max = (horizontal ? container.scrollWidth : container.scrollHeight) - viewport
      target = Math.max(0, Math.min(max, target))

      const behavior = smooth.value ? 'smooth' : 'auto'
      container.scrollTo(horizontal ? { left: target, behavior } : { top: target, behavior })
    }

    function scrollToSelected(): void {
      const selectedId = group.items.value.find(item => group.isSelected(item.id))?.id
      if (selectedId == null) return
      const el = els.get(selectedId)
      if (el) scrollToEl(el, props.centerActive)
    }

    let observer: ResizeObserver | null = null
    let reducedQuery: MediaQueryList | null = null

    function onPreferenceChange(e: MediaQueryListEvent): void {
      smooth.value = !e.matches
    }

    // Everything that reads the DOM happens here, never at module/setup time.
    onMounted(() => {
      if (typeof window === 'undefined') return

      reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      smooth.value = !reducedQuery.matches
      reducedQuery.addEventListener('change', onPreferenceChange)

      measure()
      // Measure again once the items have laid out (fonts/images reflow them).
      nextTick(() => {
        measure()
        scrollToSelected()
      })

      if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
        observer = new ResizeObserver(measure)
        observer.observe(containerRef.value)
        for (const el of els.values()) observer.observe(el)
      }
      window.addEventListener('resize', measure, { passive: true })
    })

    onBeforeUnmount(() => {
      reducedQuery?.removeEventListener('change', onPreferenceChange)
      reducedQuery = null
      if (typeof window !== 'undefined') window.removeEventListener('resize', measure)
      observer?.disconnect()
      observer = null
    })

    // `mandatory` groups always keep one item selected.
    watch(
      () => group.items.value.length,
      length => {
        if (!props.mandatory || !length) return
        if (!group.selected.value.length) group.select(group.items.value[0].id, true)
      },
      { flush: 'post' }
    )

    watch(
      () => group.selected.value,
      () => nextTick(scrollToSelected),
      { flush: 'post' }
    )

    watch(
      () => props.direction,
      () => nextTick(measure)
    )

    provide(FSlideGroupContextSymbol, {
      direction: toRef(() => props.direction),
      registerEl: (id: number, el: HTMLElement) => {
        els.set(id, el)
        observer?.observe(el)
        measure()
      },
      unregisterEl: (id: number) => {
        const el = els.get(id)
        if (el) observer?.unobserve(el)
        els.delete(id)
        measure()
      },
      onItemFocus: (id: number) => {
        const el = els.get(id)
        if (el) scrollToEl(el, props.centerActive)
      },
      onItemKeydown: (e: KeyboardEvent, id: number) => {
        const items = group.items.value
        const index = items.findIndex(item => item.id === id)
        if (index < 0) return

        const nextKey = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
        const prevKey = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'

        let target: number
        if (e.key === nextKey) target = index + 1
        else if (e.key === prevKey) target = index - 1
        else if (e.key === 'Home') target = 0
        else if (e.key === 'End') target = items.length - 1
        else return

        e.preventDefault()
        target = Math.max(0, Math.min(items.length - 1, target))
        els.get(items[target].id)?.focus()
      },
      canDeselect: () => !props.mandatory || group.selected.value.length > 1,
    })

    function control(kind: 'prev' | 'next'): VNodeChild {
      const isPrev = kind === 'prev'
      const controlProps = {
        icon: isPrev ? props.prevIcon : props.nextIcon,
        class: `fui-slide-group__arrow fui-slide-group__arrow--${kind}`,
        disabled: isPrev ? !hasPrev.value : !hasNext.value,
        'aria-label': isPrev ? 'Scroll backward' : 'Scroll forward',
        // A click moves the strip by (almost) a full viewport.
        onClick: () => scrollBy((isPrev ? -1 : 1) * containerSize.value * 0.8),
      }
      const slot = isPrev ? slots.prev : slots.next
      if (slot) return slot({ props: controlProps })

      return h(
        'button',
        {
          type: 'button',
          class: controlProps.class,
          disabled: controlProps.disabled,
          'aria-label': controlProps['aria-label'],
          // The strip is reachable with the arrow keys; the buttons are a mouse
          // affordance and would only add noise to the tab order.
          tabindex: -1,
          onClick: controlProps.onClick,
        },
        h(FIcon, { icon: controlProps.icon })
      )
    }

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-slide-group', `fui-slide-group--${props.direction}`, props.class],
          style: props.style,
        },
        [
          showArrows.value ? control('prev') : null,
          h(
            'div',
            {
              ref: containerRef,
              class: 'fui-slide-group__container',
              onScroll: measure,
            },
            [
              h(
                'div',
                { class: 'fui-slide-group__content' },
                slots.default?.({
                  isSelected: group.isSelected,
                  select: group.select,
                  selected: group.selected.value,
                })
              ),
            ]
          ),
          showArrows.value ? control('next') : null,
        ]
      )
    )
  },
})
