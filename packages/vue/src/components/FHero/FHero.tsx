import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFHeroProps = propsFactory(
  {
    /** Show the radial primary glow behind the hero. */
    glow: { type: Boolean, default: true },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FHero'
)

/**
 * A landing hero: a responsive two-column layout (copy + an optional `#visual`)
 * with a contained primary glow. Put the eyebrow/title/lede/actions in the
 * default slot and any illustration in the `#visual` slot.
 */
export const FHero = genericComponent()({
  name: 'FHero',
  props: makeFHeroProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h(
        'section',
        {
          class: ['fui-hero', { 'fui-hero--glow': props.glow }, props.class],
          style: props.style,
        },
        [
          h('div', { class: 'fui-hero__inner' }, [
            h('div', { class: 'fui-hero__copy' }, slots.default ? slots.default() : undefined),
            slots.visual ? h('div', { class: 'fui-hero__visual' }, slots.visual()) : null,
          ]),
        ]
      )
    )
  },
})
