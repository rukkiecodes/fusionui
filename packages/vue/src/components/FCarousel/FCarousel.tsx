import { Comment, Fragment, Text, computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

    // ---- Swipe ----
    let startX = 0
    let dragging = false
    function onPointerdown(e: PointerEvent): void {
      if (!props.touch) return
      dragging = true
      startX = e.clientX
      paused.value = true
    }
    function onPointerup(e: PointerEvent): void {
      if (!dragging) return
      dragging = false
      paused.value = false
      const dx = e.clientX - startX
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    }

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
            { 'fui-carousel--arrows-hover': props.showArrows === 'hover' },
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
        ]
      )
    })
  },
})
