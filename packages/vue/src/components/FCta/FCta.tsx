import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFCtaProps = propsFactory(
  {
    title: String as PropType<string>,
    text: String as PropType<string>,
    /** 'gradient' (default) tints the band in the primary color; 'flat' uses surface. */
    variant: { type: String as PropType<'gradient' | 'flat'>, default: 'gradient' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCta'
)

/**
 * A call-to-action band — a centered title + supporting text with slotted action
 * buttons, on a tinted/gradient panel. The closer for landing pages.
 */
export const FCta = genericComponent()({
  name: 'FCta',
  props: makeFCtaProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h('div', { class: ['fui-cta', props.class], style: props.style }, [
        h('div', { class: ['fui-cta__inner', `fui-cta__inner--${props.variant}`] }, [
          props.title || slots.title
            ? h('h2', { class: 'fui-cta__title' }, slots.title ? slots.title() : props.title)
            : null,
          props.text || slots.text
            ? h('p', { class: 'fui-cta__text' }, slots.text ? slots.text() : props.text)
            : null,
          slots.default ? h('div', { class: 'fui-cta__actions' }, slots.default()) : null,
        ]),
      ])
    )
  },
})
