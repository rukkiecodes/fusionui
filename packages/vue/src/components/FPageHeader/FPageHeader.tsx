import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFPageHeaderProps = propsFactory(
  {
    title: String as PropType<string>,
    subtitle: String as PropType<string>,
    /** When set, show a back link with this label; clicking emits `back`. */
    backLabel: String as PropType<string>,
    backIcon: { type: [String, Object, Function] as PropType<IconValue>, default: 'arrow-left' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FPageHeader'
)

/**
 * A page header: an optional back link (emits `back`), a title + subtitle, and
 * an `#actions` slot on the right. Router-agnostic — wire `@back` yourself.
 */
export const FPageHeader = genericComponent()({
  name: 'FPageHeader',
  props: makeFPageHeaderProps(),
  emits: { back: () => true },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    useRender(() =>
      h('div', { class: ['fui-page-header', props.class], style: props.style }, [
        props.backLabel || slots.back
          ? h(
              'button',
              {
                type: 'button',
                class: 'fui-page-header__back',
                onClick: () => emit('back'),
              },
              [
                h(FIcon, { icon: props.backIcon, class: 'fui-page-header__back-icon' }),
                slots.back ? slots.back() : props.backLabel,
              ]
            )
          : null,
        h('div', { class: 'fui-page-header__row' }, [
          h('div', { class: 'fui-page-header__titles' }, [
            props.title || slots.title
              ? h(
                  'h1',
                  { class: 'fui-page-header__title' },
                  slots.title ? slots.title() : props.title
                )
              : null,
            props.subtitle || slots.subtitle
              ? h(
                  'p',
                  { class: 'fui-page-header__subtitle' },
                  slots.subtitle ? slots.subtitle() : props.subtitle
                )
              : null,
          ]),
          slots.actions ? h('div', { class: 'fui-page-header__actions' }, slots.actions()) : null,
        ]),
      ])
    )
  },
})
