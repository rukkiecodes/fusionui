import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFCheckListProps = propsFactory(
  {
    items: { type: Array as PropType<string[]>, default: () => [] },
    /** Leading icon per item. */
    icon: { type: [String, Object, Function] as PropType<IconValue>, default: 'check' },
    /** Icon color (theme name or hex). */
    color: { type: String as PropType<string>, default: 'primary' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FCheckList'
)

/**
 * A list with a leading icon per row — for benefit/feature checklists. Pass an
 * `items` string array, or use the default slot for custom rows.
 */
export const FCheckList = genericComponent()({
  name: 'FCheckList',
  props: makeFCheckListProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const iconColor = () =>
      props.color && !props.color.startsWith('#')
        ? `rgb(var(--fui-theme-${props.color}))`
        : props.color

    useRender(() =>
      h(
        'ul',
        { class: ['fui-checklist', props.class], style: props.style },
        slots.default
          ? slots.default()
          : (props.items as string[]).map((it, i) =>
              h('li', { class: 'fui-checklist__item', key: i }, [
                h(FIcon, {
                  icon: props.icon,
                  class: 'fui-checklist__icon',
                  style: { color: iconColor() },
                }),
                h('span', null, it),
              ])
            )
      )
    )
  },
})
