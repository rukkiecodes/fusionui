import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFEmptyStateProps = propsFactory(
  {
    icon: { type: [String, Object, Function] as PropType<IconValue>, default: 'inbox' },
    title: String as PropType<string>,
    text: String as PropType<string>,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FEmptyState'
)

/**
 * A centered empty / zero-data placeholder: a muted icon, a title, optional
 * supporting text and a slotted action (e.g. a "create" button).
 */
export const FEmptyState = genericComponent()({
  name: 'FEmptyState',
  props: makeFEmptyStateProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    useRender(() =>
      h('div', { class: ['fui-empty-state', props.class], style: props.style }, [
        props.icon ? h(FIcon, { icon: props.icon, class: 'fui-empty-state__icon' }) : null,
        props.title || slots.title
          ? h('h3', { class: 'fui-empty-state__title' }, slots.title ? slots.title() : props.title)
          : null,
        props.text || slots.text
          ? h('p', { class: 'fui-empty-state__text' }, slots.text ? slots.text() : props.text)
          : null,
        slots.default ? h('div', { class: 'fui-empty-state__action' }, slots.default()) : null,
      ])
    )
  },
})
