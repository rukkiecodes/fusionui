import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFListProps = propsFactory(
  {
    nav: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FList'
)

export const FList = genericComponent()({
  name: 'FList',
  props: makeFListProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    useRender(() =>
      h(
        'div',
        {
          class: ['fui-list', { 'fui-list--nav': props.nav }, props.class],
          style: props.style,
          role: 'list',
        },
        slots.default?.()
      )
    )
  },
})

export const makeFListItemProps = propsFactory(
  {
    title: [String, Number] as PropType<string | number>,
    subtitle: [String, Number] as PropType<string | number>,
    prependIcon: [String, Object, Function] as PropType<IconValue>,
    appendIcon: [String, Object, Function] as PropType<IconValue>,
    active: Boolean,
    disabled: Boolean,
    link: Boolean,
    color: { type: String as PropType<string>, default: 'primary' },
    ...makeComponentProps(),
  },
  'FListItem'
)

export const FListItem = genericComponent()({
  name: 'FListItem',
  props: makeFListItemProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    useRender(() =>
      h(
        'div',
        {
          class: [
            'fui-list-item',
            {
              'fui-list-item--active': props.active,
              'fui-list-item--disabled': props.disabled,
              'fui-list-item--link': props.link || props.active,
            },
            props.class,
          ],
          style: [{ '--fui-list-item-color': `var(--fui-theme-${props.color})` }, props.style],
          role: 'listitem',
          onClick: (e: MouseEvent) => {
            if (!props.disabled) emit('click', e)
          },
        },
        [
          props.prependIcon || slots.prepend
            ? h('div', { class: 'fui-list-item__prepend' }, [
                slots.prepend ? slots.prepend() : h(FIcon, { icon: props.prependIcon }),
              ])
            : null,
          h('div', { class: 'fui-list-item__content' }, [
            slots.default
              ? slots.default()
              : [
                  props.title != null
                    ? h('div', { class: 'fui-list-item__title' }, props.title)
                    : null,
                  props.subtitle != null
                    ? h('div', { class: 'fui-list-item__subtitle' }, props.subtitle)
                    : null,
                ],
          ]),
          props.appendIcon || slots.append
            ? h('div', { class: 'fui-list-item__append' }, [
                slots.append ? slots.append() : h(FIcon, { icon: props.appendIcon }),
              ])
            : null,
        ]
      )
    )
  },
})
