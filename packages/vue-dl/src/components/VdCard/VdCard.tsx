import { h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { VdIcon } from '../VdIcon'

export type VdCardType = '1' | '2' | '3' | '4' | '5' | '6'

export const makeVdCardProps = propsFactory(
  {
    // Layout style, mirroring the five Vuesax card types (1 = default).
    // Type 6 adds a scroll-driven parallax on the image.
    type: { type: [String, Number] as PropType<string | number>, default: '1' },
    // Type 6 only: how far (px) the image drifts across a full pass through
    // the viewport. Higher = more intense.
    parallax: { type: [Number, String] as PropType<number | string>, default: 280 },
    // Convenience props for simple cards (slots take precedence).
    image: String as PropType<string>,
    img: String as PropType<string>,
    title: String as PropType<string>,
    text: String as PropType<string>,
    ...makeTagProps({ tag: 'div' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdCard'
)

export const VdCard = genericComponent()({
  name: 'VdCard',
  inheritAttrs: false,
  props: makeVdCardProps(),
  setup(props: any, { slots, attrs }: any) {
    provideTheme(props)

    // ---- Type 6: scroll-driven image parallax ---------------------------
    const cardRef = ref<HTMLElement>()
    let frame = 0
    let attached = false

    function updateParallax() {
      frame = 0
      if (String(props.type) !== '6') return
      const el = cardRef.value
      const img = el?.querySelector('.vd-card__img img') as HTMLElement | null
      if (!el || !img) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      // 0 as the card enters from the bottom → 1 as it leaves past the top.
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
      const range = Number(props.parallax) || 0
      const shift = (0.5 - progress) * range
      img.style.transform = `translate3d(0, ${shift}px, 0)`
    }

    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(updateParallax)
    }

    function attach() {
      if (attached || typeof window === 'undefined') return
      attached = true
      // Capture phase so scrolling inside any container (not just the window)
      // still drives the effect.
      window.addEventListener('scroll', onScroll, { passive: true, capture: true })
      window.addEventListener('resize', onScroll, { passive: true })
      nextTick(updateParallax)
    }

    function detach() {
      if (!attached) return
      attached = false
      window.removeEventListener('scroll', onScroll, { capture: true } as any)
      window.removeEventListener('resize', onScroll)
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    onMounted(() => {
      if (String(props.type) === '6') attach()
    })

    // Attach/detach as the type switches (e.g. in the docs playground), and
    // re-run when the intensity changes.
    watch(
      () => String(props.type),
      t => (t === '6' ? attach() : detach())
    )
    watch(
      () => props.parallax,
      () => updateParallax()
    )

    onBeforeUnmount(detach)

    useRender(() => {
      const src = props.image ?? props.img
      const hasImg = !!(slots.img || src)
      const hasTitle = !!(slots.title || props.title)
      const hasText = !!(slots.text || props.text)

      const interactions = slots.interactions
        ? h('div', { class: 'vd-card__interactions' }, [slots.interactions()])
        : null

      const imgNode = hasImg
        ? h('div', { class: 'vd-card__img' }, [
            slots.img ? slots.img() : h('img', { src, alt: '' }),
            interactions,
          ])
        : null

      const titleNode = hasTitle
        ? h('div', { class: 'vd-card__title' }, [
            slots.title ? slots.title() : h('h3', props.title),
          ])
        : null

      const textNode =
        hasTitle || hasText
          ? h('div', { class: 'vd-card__text' }, [
              titleNode,
              slots.text ? slots.text() : props.text ? h('p', props.text) : null,
            ])
          : null

      const buttonsNode = slots.buttons
        ? h('div', { class: 'vd-card__buttons' }, [slots.buttons()])
        : null

      const card = h(props.tag, { class: 'vd-card', ...attrs, ref: cardRef }, [
        imgNode,
        textNode,
        buttonsNode,
        slots.default?.(),
      ])

      // Half the drift range is how much overflow the image needs on each side.
      const parallaxStyle =
        String(props.type) === '6'
          ? { '--vd-parallax-room': `${(Number(props.parallax) || 0) / 2}px` }
          : null

      return h(
        'div',
        {
          class: ['vd-card-content', `vd-card-content--type-${props.type}`, props.class],
          style: [props.style, parallaxStyle],
        },
        [card]
      )
    })
  },
})

export const VdCardGroup = genericComponent()({
  name: 'VdCardGroup',
  props: {
    ...makeComponentProps(),
    ...makeTagProps({ tag: 'div' }),
  },
  setup(props: any, { slots }: any) {
    const cards = ref<HTMLElement>()

    function scrollBy(direction: number) {
      const el = cards.value
      if (!el) return
      el.scrollTo({ left: el.scrollLeft + direction * el.clientWidth, behavior: 'smooth' })
    }

    useRender(() =>
      h('div', { class: ['vd-card-group', props.class], style: props.style }, [
        h(
          'button',
          {
            class: 'vd-card-group__nav vd-card-group__prev',
            type: 'button',
            'aria-label': 'Previous',
            onClick: () => scrollBy(-1),
          },
          [h(VdIcon, { icon: '$prev' })]
        ),
        h('div', { class: 'vd-card-group__cards', ref: cards }, [slots.default?.()]),
        h(
          'button',
          {
            class: 'vd-card-group__nav vd-card-group__next',
            type: 'button',
            'aria-label': 'Next',
            onClick: () => scrollBy(1),
          },
          [h(VdIcon, { icon: '$next' })]
        ),
      ])
    )
  },
})

function makeSection(name: string, klass: string) {
  return genericComponent()({
    name,
    props: { ...makeComponentProps(), ...makeTagProps({ tag: 'div' }) },
    setup(props: any, { slots }: any) {
      useRender(() =>
        h(props.tag, { class: [klass, props.class], style: props.style }, slots.default?.())
      )
    },
  })
}

export const VdCardTitle = makeSection('VdCardTitle', 'vd-card__title')
export const VdCardText = makeSection('VdCardText', 'vd-card__text')
export const VdCardButtons = makeSection('VdCardButtons', 'vd-card__buttons')
