import { h, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps } from '../../composables/component'

export const makeFParallaxProps = propsFactory(
  {
    src: String as PropType<string>,
    alt: { type: String as PropType<string>, default: '' },
    height: { type: [String, Number] as PropType<string | number>, default: 400 },
    /** How far the image drifts against the scroll — 0 is static, 1 tracks it exactly. */
    scale: { type: [Number, String] as PropType<number | string>, default: 0.3 },
    ...makeComponentProps(),
  },
  'FParallax'
)

/**
 * A banner whose image drifts against the page as you scroll.
 *
 * The effect is pure decoration, so it is the first thing to go: under
 * `prefers-reduced-motion` — and on any browser without IntersectionObserver —
 * the image simply renders static and centred. The scroll handler only runs
 * while the banner is actually on screen, and it writes on an animation frame,
 * so it never lands in the scroll critical path.
 */
export const FParallax = genericComponent()({
  name: 'FParallax',
  props: makeFParallaxProps(),
  setup(props: any, { slots }: any) {
    const root = ref<HTMLElement>()
    const offset = ref(0)

    let observer: IntersectionObserver | undefined
    let visible = false
    let frame = 0

    function compute(): void {
      frame = 0
      const el = root.value
      if (!el) return

      const rect = el.getBoundingClientRect()
      // How far the element's centre is from the viewport's, in px. The image is
      // over-sized by `scale`, so it has room to move without exposing an edge.
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2
      offset.value = -delta * Number(props.scale)
    }

    function onScroll(): void {
      if (!visible || frame) return
      frame = requestAnimationFrame(compute)
    }

    onMounted(() => {
      // Decoration only: never animate against the user's stated preference.
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

      if (reduced || typeof IntersectionObserver === 'undefined') return

      observer = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting)
        if (visible) compute()
      })
      if (root.value) observer.observe(root.value)

      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    })

    onBeforeUnmount(() => {
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
      if (typeof window === 'undefined') return
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    })

    useRender(() =>
      h(
        'div',
        {
          ref: root,
          class: ['fui-parallax', props.class],
          style: [{ height: convertToUnit(props.height) }, props.style],
        },
        [
          h('img', {
            class: 'fui-parallax__image',
            src: props.src,
            alt: props.alt,
            // Decorative banners usually have no meaningful alt; hide them from AT
            // rather than announcing an empty image.
            'aria-hidden': props.alt ? undefined : 'true',
            style: {
              transform: `translate(-50%, calc(-50% + ${offset.value}px))`,
              // Grow the image by the same factor it is allowed to travel.
              minHeight: `calc(100% + ${Math.abs(Number(props.scale)) * 100}%)`,
            },
          }),
          slots.default ? h('div', { class: 'fui-parallax__content' }, slots.default()) : null,
        ]
      )
    )
  },
})
