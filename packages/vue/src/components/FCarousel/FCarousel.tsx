import {
  Comment,
  Fragment,
  Teleport,
  Text,
  computed,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import type { PropType, VNode } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useProxiedModel } from '../../composables/proxiedModel'
import { convertToUnit } from '../../util/helpers'
import { FIcon } from '../FIcon'
import { FImage } from '../FImage'

/** Flatten slot children (v-for produces Fragments) and drop comment/text nodes. */
function flattenSlides(nodes: VNode[]): VNode[] {
  const out: VNode[] = []
  for (const n of nodes) {
    if (n.type === Fragment) out.push(...flattenSlides((n.children as VNode[]) ?? []))
    else if (n.type !== Comment && n.type !== Text) out.push(n)
  }
  return out
}

export const makeFCarouselProps = propsFactory(
  {
    /** Active slide index (v-model). */
    modelValue: { type: Number as PropType<number>, default: undefined },
    /** Convenience: pass slides as data instead of `FCarouselItem` children. */
    items: { type: Array as PropType<unknown[]>, default: () => [] },
    /** Property to read the image URL from when an item is an object. */
    srcKey: { type: String as PropType<string>, default: 'url' },
    /** Auto-advance slides. */
    cycle: Boolean,
    /** Auto-advance interval (ms). */
    interval: { type: [Number, String] as PropType<number | string>, default: 6000 },
    /** Wrap around at the ends. */
    continuous: { type: Boolean, default: true },
    /** `true`, `false`, or `'hover'`. */
    showArrows: { type: [Boolean, String] as PropType<boolean | 'hover'>, default: true },
    /** Hide the dot delimiters. */
    hideDelimiters: Boolean,
    /** No-op placeholder for Vuetify parity (FusionUI delimiters have no backing bar). */
    hideDelimiterBackground: Boolean,
    /** Render an icon inside each delimiter instead of a dot. */
    delimiterIcon: String as PropType<string>,
    /** Show a determinate progress bar; pass a color string to theme it. */
    progress: { type: [Boolean, String] as PropType<boolean | string>, default: false },
    /** Fixed viewport height (overrides `aspectRatio`). */
    height: [String, Number] as PropType<string | number>,
    /** Viewport aspect ratio when `height` is not set. */
    aspectRatio: { type: [String, Number] as PropType<string | number>, default: '16 / 9' },
    /** Crop images to fill each slide. */
    cover: { type: Boolean, default: true },
    /** Enable swipe/drag navigation. */
    touch: { type: Boolean, default: true },
    /** Click a slide (or the expand button) to open it in a fullscreen lightbox. */
    lightbox: Boolean,
    /** A "3 / 12" counter overlay. */
    counter: Boolean,
    /** A scrollable thumbnail strip. */
    thumbnails: Boolean,
    prevIcon: { type: String as PropType<string>, default: 'chevron-left' },
    nextIcon: { type: String as PropType<string>, default: 'chevron-right' },
    /** Theme color for controls/indicators/progress. */
    color: { type: String as PropType<string>, default: 'primary' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCarousel'
)

export const FCarousel = genericComponent()({
  name: 'FCarousel',
  props: makeFCarouselProps(),
  emits: { 'update:modelValue': (_v: number) => true },
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const active = useProxiedModel(props, 'modelValue', 0)

    function resolveSrc(item: any): string {
      if (item == null) return ''
      if (typeof item === 'string') return item
      return item[props.srcKey] ?? item.url ?? item.src ?? item.image ?? ''
    }

    // Build slides (and thumbnail sources) from either `items` or child items.
    function build(): { slides: VNode[]; thumbs: string[] } {
      if (props.items.length) {
        const slides = props.items.map((item: any, i: number) =>
          slots.item
            ? slots.item({ item, index: i, active: i === (active.value ?? 0) })
            : h(FImage, { src: resolveSrc(item), alt: '', cover: props.cover, height: '100%' })
        )
        return { slides, thumbs: props.items.map((it: any) => resolveSrc(it)) }
      }
      const children = flattenSlides(slots.default?.() ?? [])
      return { slides: children, thumbs: children.map(c => (c.props?.src as string) ?? '') }
    }

    const count = computed(() =>
      props.items.length ? props.items.length : flattenSlides(slots.default?.() ?? []).length
    )

    function go(i: number): void {
      const n = count.value
      if (n === 0) return
      active.value = props.continuous ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i))
    }
    const prev = (): void => go((active.value ?? 0) - 1)
    const next = (): void => go((active.value ?? 0) + 1)

    watch(count, n => {
      if ((active.value ?? 0) > n - 1) active.value = Math.max(0, n - 1)
    })

    // ---- Autoplay ----
    const paused = ref(false)
    let timer: ReturnType<typeof setInterval> | null = null
    const stop = (): void => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
    function start(): void {
      stop()
      if (props.cycle && count.value > 1) {
        timer = setInterval(
          () => {
            if (!paused.value) next()
          },
          Number(props.interval) || 6000
        )
      }
    }
    onMounted(start)
    watch(() => [props.cycle, props.interval, count.value], start)
    onBeforeUnmount(stop)

    // ---- Swipe + tap-to-open ----
    let startX = 0
    let dragging = false
    function onPointerdown(e: PointerEvent): void {
      startX = e.clientX
      if (props.touch) {
        dragging = true
        paused.value = true
      }
    }
    function onPointerup(e: PointerEvent): void {
      const dx = e.clientX - startX
      if (dragging) {
        dragging = false
        paused.value = false
      }
      if (props.touch && Math.abs(dx) > 40) {
        ;(dx < 0 ? next : prev)()
        return
      }
      // A tap (not a drag) opens the lightbox.
      if (props.lightbox && Math.abs(dx) <= 6) lbOpen.value = true
    }

    // ---- Fullscreen lightbox (with zoom + pan) ----
    const lbOpen = ref(false)
    const lbImg = ref<HTMLImageElement | null>(null)
    const scale = ref(1)
    const panX = ref(0)
    const panY = ref(0)
    const panning = ref(false)
    let panSX = 0
    let panSY = 0
    let panOX = 0
    let panOY = 0

    function resetZoom(): void {
      scale.value = 1
      panX.value = 0
      panY.value = 0
    }
    // Keep the image edges from panning past the viewport at the current scale.
    function clampPan(): void {
      const el = lbImg.value
      const maxX = el ? (el.offsetWidth * (scale.value - 1)) / 2 : 0
      const maxY = el ? (el.offsetHeight * (scale.value - 1)) / 2 : 0
      panX.value = Math.max(-maxX, Math.min(maxX, panX.value))
      panY.value = Math.max(-maxY, Math.min(maxY, panY.value))
    }
    function zoomTo(s: number): void {
      scale.value = Math.max(1, Math.min(4, Math.round(s * 100) / 100))
      if (scale.value === 1) {
        panX.value = 0
        panY.value = 0
      } else {
        clampPan()
      }
    }
    const zoomIn = (): void => zoomTo(scale.value + 0.5)
    const zoomOut = (): void => zoomTo(scale.value - 0.5)
    function onLbWheel(e: WheelEvent): void {
      e.preventDefault()
      zoomTo(scale.value + (e.deltaY < 0 ? 0.35 : -0.35))
    }
    // Drag-to-pan (only meaningful while zoomed in).
    function onImgDown(e: PointerEvent): void {
      if (scale.value <= 1) return
      panning.value = true
      panSX = e.clientX
      panSY = e.clientY
      panOX = panX.value
      panOY = panY.value
      ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
      e.stopPropagation()
    }
    function onImgMove(e: PointerEvent): void {
      if (!panning.value) return
      panX.value = panOX + (e.clientX - panSX)
      panY.value = panOY + (e.clientY - panSY)
      clampPan()
    }
    function onImgUp(): void {
      panning.value = false
    }

    function onLbKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') lbOpen.value = false
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-') zoomOut()
      else if (e.key === '0') resetZoom()
    }
    // Reset zoom whenever the active slide changes.
    watch(active, resetZoom)
    // Wire global keys + lock body scroll while the lightbox is open.
    watch(lbOpen, open => {
      if (typeof document === 'undefined') return
      paused.value = open
      if (open) resetZoom()
      if (open) {
        document.addEventListener('keydown', onLbKey)
        document.body.style.overflow = 'hidden'
      } else {
        document.removeEventListener('keydown', onLbKey)
        document.body.style.overflow = ''
      }
    })
    onBeforeUnmount(() => {
      if (typeof document === 'undefined') return
      document.removeEventListener('keydown', onLbKey)
      document.body.style.overflow = ''
    })

    function onKeydown(e: KeyboardEvent): void {
      if (e.key === 'ArrowLeft') {
        prev()
        e.preventDefault()
      } else if (e.key === 'ArrowRight') {
        next()
        e.preventDefault()
      }
    }

    const viewportStyle = computed(() =>
      props.height
        ? { height: convertToUnit(props.height) }
        : { aspectRatio: String(props.aspectRatio) }
    )

    useRender(() => {
      const n = count.value
      const cur = active.value ?? 0
      const { slides, thumbs } = build()
      const arrowsOn = props.showArrows !== false && n > 1

      return h(
        'div',
        {
          class: [
            'fui-carousel',
            {
              'fui-carousel--arrows-hover': props.showArrows === 'hover',
              'fui-carousel--lightbox': props.lightbox,
            },
            props.class,
          ],
          style: [{ '--fui-carousel-color': `var(--fui-theme-${props.color})` }, props.style],
          tabindex: 0,
          role: 'region',
          'aria-roledescription': 'carousel',
          onKeydown,
          onMouseenter: () => {
            paused.value = true
          },
          onMouseleave: () => {
            paused.value = false
          },
        },
        [
          h(
            'div',
            {
              class: 'fui-carousel__viewport',
              style: viewportStyle.value,
              onPointerdown,
              onPointerup,
              onPointercancel: onPointerup,
            },
            [
              n
                ? h(
                    'div',
                    {
                      class: 'fui-carousel__track',
                      style: { transform: `translateX(-${cur * 100}%)` },
                    },
                    slides.map((slide, i) =>
                      h('div', { key: i, class: 'fui-carousel__slide', 'aria-hidden': i !== cur }, [
                        slide,
                      ])
                    )
                  )
                : (slots.empty?.() ?? null),
              // Progress bar
              props.progress && n > 1
                ? h('div', { class: 'fui-carousel__progress' }, [
                    h('div', {
                      class: 'fui-carousel__progress-bar',
                      style: {
                        width: `${((cur + 1) / n) * 100}%`,
                        background:
                          typeof props.progress === 'string'
                            ? props.progress
                            : 'rgb(var(--fui-carousel-color))',
                      },
                    }),
                  ])
                : null,
              // Counter
              props.counter && n
                ? h('div', { class: 'fui-carousel__counter' }, `${cur + 1} / ${n}`)
                : null,
              // Prev / next controls
              arrowsOn
                ? slots.prev
                  ? slots.prev({ props: { onClick: prev } })
                  : h(
                      'button',
                      {
                        class: 'fui-carousel__arrow fui-carousel__arrow--prev',
                        type: 'button',
                        'aria-label': 'Previous slide',
                        onClick: prev,
                      },
                      h(FIcon, { icon: props.prevIcon })
                    )
                : null,
              arrowsOn
                ? slots.next
                  ? slots.next({ props: { onClick: next } })
                  : h(
                      'button',
                      {
                        class: 'fui-carousel__arrow fui-carousel__arrow--next',
                        type: 'button',
                        'aria-label': 'Next slide',
                        onClick: next,
                      },
                      h(FIcon, { icon: props.nextIcon })
                    )
                : null,
              // Expand → open lightbox
              props.lightbox && n
                ? h(
                    'button',
                    {
                      class: 'fui-carousel__expand',
                      type: 'button',
                      'aria-label': 'View fullscreen',
                      onClick: () => {
                        lbOpen.value = true
                      },
                    },
                    h(FIcon, { icon: 'maximize-2' })
                  )
                : null,
            ]
          ),
          // Delimiters (dots)
          !props.hideDelimiters && n > 1
            ? h(
                'div',
                { class: 'fui-carousel__dots' },
                Array.from({ length: n }, (_, i) =>
                  h(
                    'button',
                    {
                      key: i,
                      type: 'button',
                      class: [
                        'fui-carousel__dot',
                        {
                          'fui-carousel__dot--active': i === cur,
                          'fui-carousel__dot--icon': !!props.delimiterIcon,
                        },
                      ],
                      'aria-label': `Go to slide ${i + 1}`,
                      'aria-current': i === cur,
                      onClick: () => go(i),
                    },
                    props.delimiterIcon
                      ? h(FIcon, { icon: props.delimiterIcon, size: 'small' })
                      : undefined
                  )
                )
              )
            : null,
          // Thumbnails
          props.thumbnails && n > 1
            ? h(
                'div',
                { class: 'fui-carousel__thumbs' },
                thumbs.map((src, i) =>
                  h(
                    'button',
                    {
                      key: i,
                      type: 'button',
                      class: ['fui-carousel__thumb', { 'fui-carousel__thumb--active': i === cur }],
                      'aria-label': `View image ${i + 1}`,
                      onClick: () => go(i),
                    },
                    src ? h('img', { src, alt: '', draggable: false, loading: 'lazy' }) : undefined
                  )
                )
              )
            : null,
          // ---- Fullscreen lightbox overlay ----
          props.lightbox && lbOpen.value
            ? h(
                Teleport,
                { to: 'body' },
                h(
                  'div',
                  {
                    class: 'fui-carousel-lightbox',
                    role: 'dialog',
                    'aria-modal': 'true',
                    onClick: (e: MouseEvent) => {
                      if (e.target === e.currentTarget) lbOpen.value = false
                    },
                  },
                  [
                    h(
                      'button',
                      {
                        class: 'fui-carousel-lightbox__close',
                        type: 'button',
                        'aria-label': 'Close',
                        onClick: () => {
                          lbOpen.value = false
                        },
                      },
                      h(FIcon, { icon: 'x' })
                    ),
                    h('div', { class: 'fui-carousel-lightbox__zoom' }, [
                      h(
                        'button',
                        {
                          class: 'fui-carousel-lightbox__zoombtn',
                          type: 'button',
                          'aria-label': 'Zoom out',
                          disabled: scale.value <= 1,
                          onClick: zoomOut,
                        },
                        h(FIcon, { icon: 'zoom-out' })
                      ),
                      h(
                        'button',
                        {
                          class: 'fui-carousel-lightbox__zoombtn',
                          type: 'button',
                          'aria-label': 'Zoom in',
                          disabled: scale.value >= 4,
                          onClick: zoomIn,
                        },
                        h(FIcon, { icon: 'zoom-in' })
                      ),
                    ]),
                    n
                      ? h('div', { class: 'fui-carousel-lightbox__counter' }, `${cur + 1} / ${n}`)
                      : null,
                    n > 1
                      ? h(
                          'button',
                          {
                            class:
                              'fui-carousel-lightbox__arrow fui-carousel-lightbox__arrow--prev',
                            type: 'button',
                            'aria-label': 'Previous',
                            onClick: prev,
                          },
                          h(FIcon, { icon: props.prevIcon })
                        )
                      : null,
                    h('div', { class: 'fui-carousel-lightbox__stage', onWheel: onLbWheel }, [
                      thumbs[cur]
                        ? h('img', {
                            ref: lbImg,
                            class: [
                              'fui-carousel-lightbox__img',
                              {
                                'fui-carousel-lightbox__img--zoomed': scale.value > 1,
                                'fui-carousel-lightbox__img--panning': panning.value,
                              },
                            ],
                            src: thumbs[cur],
                            alt: '',
                            draggable: false,
                            style: {
                              transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
                            },
                            onPointerdown: onImgDown,
                            onPointermove: onImgMove,
                            onPointerup: onImgUp,
                            onPointercancel: onImgUp,
                            onDblclick: () => zoomTo(scale.value > 1 ? 1 : 2.5),
                          })
                        : null,
                    ]),
                    n > 1
                      ? h(
                          'button',
                          {
                            class:
                              'fui-carousel-lightbox__arrow fui-carousel-lightbox__arrow--next',
                            type: 'button',
                            'aria-label': 'Next',
                            onClick: next,
                          },
                          h(FIcon, { icon: props.nextIcon })
                        )
                      : null,
                    n > 1
                      ? h(
                          'div',
                          { class: 'fui-carousel-lightbox__thumbs' },
                          thumbs.map((src, i) =>
                            h(
                              'button',
                              {
                                key: i,
                                type: 'button',
                                class: [
                                  'fui-carousel-lightbox__thumb',
                                  { 'fui-carousel-lightbox__thumb--active': i === cur },
                                ],
                                'aria-label': `View image ${i + 1}`,
                                onClick: () => go(i),
                              },
                              src
                                ? h('img', { src, alt: '', draggable: false, loading: 'lazy' })
                                : undefined
                            )
                          )
                        )
                      : null,
                  ]
                )
              )
            : null,
        ]
      )
    })
  },
})
