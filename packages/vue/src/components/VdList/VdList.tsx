import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { VdIcon } from '../VdIcon'

export const makeVdListProps = propsFactory(
  {
    nav: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'VdList'
)

export const VdList = genericComponent()({
  name: 'VdList',
  props: makeVdListProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    useRender(() =>
      h(
        'div',
        {
          class: ['vd-list', { 'vd-list--nav': props.nav }, props.class],
          style: props.style,
          role: 'list',
        },
        slots.default?.()
      )
    )
  },
})

export const makeVdListItemProps = propsFactory(
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
  'VdListItem'
)

export const VdListItem = genericComponent()({
  name: 'VdListItem',
  props: makeVdListItemProps(),
  emits: { click: (_e: MouseEvent) => true },
  setup(props: any, { slots, emit }: any) {
    useRender(() =>
      h(
        'div',
        {
          class: [
            'vd-list-item',
            {
              'vd-list-item--active': props.active,
              'vd-list-item--disabled': props.disabled,
              'vd-list-item--link': props.link || props.active,
            },
            props.class,
          ],
          style: [{ '--vd-list-item-color': `var(--vd-theme-${props.color})` }, props.style],
          role: 'listitem',
          onClick: (e: MouseEvent) => {
            if (!props.disabled) emit('click', e)
          },
        },
        [
          props.prependIcon || slots.prepend
            ? h('div', { class: 'vd-list-item__prepend' }, [
                slots.prepend ? slots.prepend() : h(VdIcon, { icon: props.prependIcon }),
              ])
            : null,
          h('div', { class: 'vd-list-item__content' }, [
            slots.default
              ? slots.default()
              : [
                  props.title != null
                    ? h('div', { class: 'vd-list-item__title' }, props.title)
                    : null,
                  props.subtitle != null
                    ? h('div', { class: 'vd-list-item__subtitle' }, props.subtitle)
                    : null,
                ],
          ]),
          props.appendIcon || slots.append
            ? h('div', { class: 'vd-list-item__append' }, [
                slots.append ? slots.append() : h(VdIcon, { icon: props.appendIcon }),
              ])
            : null,
        ]
      )
    )
  },
})
