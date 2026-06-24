import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFValueCardProps = propsFactory(
  {
    /** Small uppercase label above the title. */
    tag: String as PropType<string>,
    title: String as PropType<string>,
    /** Tint the card in the primary color to make it the hero of a pair. */
    accent: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FValueCard'
)

/**
 * A value-proposition card — a tag + title over slotted content (copy, lists,
 * actions). Pair an `accent` card with a plain one for "for X / for Y" sections.
 */
export const FValueCard = genericComponent()({
  name: 'FValueCard',
  props: makeFValueCardProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h(
        'article',
        {
          class: ['fui-value-card', { 'fui-value-card--accent': props.accent }, props.class],
          style: props.style,
        },
        [
          props.tag || slots.tag
            ? h('span', { class: 'fui-value-card__tag' }, slots.tag ? slots.tag() : props.tag)
            : null,
          props.title || slots.title
            ? h('h3', { class: 'fui-value-card__title' }, slots.title ? slots.title() : props.title)
            : null,
          slots.default ? h('div', { class: 'fui-value-card__body' }, slots.default()) : null,
        ]
      )
    )
  },
})
