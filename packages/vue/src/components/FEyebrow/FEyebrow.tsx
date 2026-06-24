import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFEyebrowProps = propsFactory(
  {
    text: String as PropType<string>,
    /** Show a leading status dot. */
    dot: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FEyebrow'
)

/**
 * A small tinted pill label that sits above a heading — the "eyebrow" of a hero
 * or section. Optional status dot.
 */
export const FEyebrow = genericComponent()({
  name: 'FEyebrow',
  props: makeFEyebrowProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() => {
      const isTheme = props.color && !props.color.startsWith('#')
      return h(
        'span',
        {
          class: ['fui-eyebrow', props.class],
          style: [
            isTheme ? { '--fui-eyebrow-color': `var(--fui-theme-${props.color})` } : null,
            props.style,
          ],
        },
        [
          props.dot ? h('span', { class: 'fui-eyebrow__dot' }) : null,
          h('span', { class: 'fui-eyebrow__text' }, slots.default ? slots.default() : props.text),
        ]
      )
    })
  },
})
