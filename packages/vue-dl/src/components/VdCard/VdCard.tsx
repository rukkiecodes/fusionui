import { h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { VdIcon } from '../VdIcon'

export type VdCardType = '1' | '2' | '3' | '4' | '5'

export const makeVdCardProps = propsFactory(
  {
    // Layout style, mirroring the five Vuesax card types (1 = default).
    type: { type: [String, Number] as PropType<string | number>, default: '1' },
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

      const card = h(props.tag, { class: 'vd-card', ...attrs }, [
        imgNode,
        textNode,
        buttonsNode,
        slots.default?.(),
      ])

      return h(
        'div',
        {
          class: ['vd-card-content', `vd-card-content--type-${props.type}`, props.class],
          style: props.style,
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
