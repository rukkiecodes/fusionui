import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'

export const makeFStatusPillProps = propsFactory(
  {
    label: String as PropType<string>,
    /** Theme color name (primary, success, warning, danger, …) or hex triplet. */
    color: { type: String as PropType<string>, default: 'primary' },
    /** Show a leading dot. */
    dot: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FStatusPill'
)

/**
 * A compact, tinted status pill — for escrow/project/dispute states and the
 * like. Semantic `color` drives both the tint and the text.
 */
export const FStatusPill = genericComponent()({
  name: 'FStatusPill',
  props: makeFStatusPillProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() => {
      const isTheme = props.color && !props.color.startsWith('#')
      return h(
        'span',
        {
          class: ['fui-status-pill', props.class],
          style: [
            isTheme ? { '--fui-status-color': `var(--fui-theme-${props.color})` } : null,
            props.style,
          ],
        },
        [
          props.dot ? h('span', { class: 'fui-status-pill__dot' }) : null,
          h(
            'span',
            { class: 'fui-status-pill__label' },
            slots.default ? slots.default() : props.label
          ),
        ]
      )
    })
  },
})
