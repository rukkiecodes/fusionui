import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export interface FStepItem {
  title?: string
  text?: string
  icon?: IconValue
  /** Override the auto-generated number (defaults to 01, 02, …). */
  n?: string | number
}

export const makeFStepsProps = propsFactory(
  {
    items: { type: Array as PropType<FStepItem[]>, default: () => [] },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSteps'
)

/**
 * A responsive, auto-numbered set of step cards (icon + title + text). Great for
 * "how it works" sections. Pass an `items` array; numbering is automatic.
 */
export const FSteps = genericComponent()({
  name: 'FSteps',
  props: makeFStepsProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h(
        'div',
        { class: ['fui-steps', props.class], style: props.style },
        slots.default
          ? slots.default()
          : (props.items as FStepItem[]).map((it, i) =>
              h('article', { class: 'fui-step', key: i }, [
                h('span', { class: 'fui-step__n' }, String(it.n ?? String(i + 1).padStart(2, '0'))),
                it.icon
                  ? h('span', { class: 'fui-step__icon' }, [h(FIcon, { icon: it.icon })])
                  : null,
                it.title ? h('h3', { class: 'fui-step__title' }, it.title) : null,
                it.text ? h('p', { class: 'fui-step__text' }, it.text) : null,
              ])
            )
      )
    )
  },
})
