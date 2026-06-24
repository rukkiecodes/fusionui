import { h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import type { IconValue } from '../../composables/icons'
import { FIcon } from '../FIcon'

export const makeFOptionCardProps = propsFactory(
  {
    icon: { type: [String, Object, Function] as PropType<IconValue>, default: undefined },
    title: String as PropType<string>,
    text: String as PropType<string>,
    /** Selected (active) state — drives the highlight + check. */
    selected: Boolean,
    disabled: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FOptionCard'
)

/**
 * A large, selectable choice card (icon + title + text with a check indicator) —
 * for role pickers, plan selection and other "choose one" steps. Parent owns the
 * selection: bind `selected` and handle `@select`.
 */
export const FOptionCard = genericComponent()({
  name: 'FOptionCard',
  props: makeFOptionCardProps(),
  emits: { select: () => true },
  setup(props: any, { slots, emit }: any) {
    provideTheme(props)

    useRender(() =>
      h(
        'button',
        {
          type: 'button',
          class: [
            'fui-option-card',
            {
              'fui-option-card--selected': props.selected,
              'fui-option-card--disabled': props.disabled,
            },
            props.class,
          ],
          style: props.style,
          disabled: props.disabled,
          'aria-pressed': props.selected,
          onClick: () => !props.disabled && emit('select'),
        },
        [
          props.icon || slots.icon
            ? h(
                'span',
                { class: 'fui-option-card__icon' },
                slots.icon ? slots.icon() : [h(FIcon, { icon: props.icon })]
              )
            : null,
          h('span', { class: 'fui-option-card__body' }, [
            props.title || slots.title
              ? h(
                  'span',
                  { class: 'fui-option-card__title' },
                  slots.title ? slots.title() : props.title
                )
              : null,
            props.text || slots.default
              ? h(
                  'span',
                  { class: 'fui-option-card__text' },
                  slots.default ? slots.default() : props.text
                )
              : null,
          ]),
          h('span', { class: 'fui-option-card__check' }, [h(FIcon, { icon: 'check' })]),
        ]
      )
    )
  },
})
