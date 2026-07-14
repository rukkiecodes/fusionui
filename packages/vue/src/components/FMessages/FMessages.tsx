import { TransitionGroup, computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useTextColor } from '../../composables/color'

export const makeFMessagesProps = propsFactory(
  {
    messages: {
      type: [String, Array] as PropType<string | string[]>,
      default: () => [],
    },
    active: Boolean,
    color: String as PropType<string>,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FMessages'
)

export const FMessages = genericComponent()({
  name: 'FMessages',
  props: makeFMessagesProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const messages = computed<string[]>(() => {
      const value = props.messages
      if (Array.isArray(value)) return value
      return value == null || value === '' ? [] : [value]
    })

    const { colorClasses, colorStyles } = useTextColor(() => props.color)

    useRender(() =>
      h(
        TransitionGroup,
        {
          name: 'fui-messages-transition',
          tag: 'div',
          class: ['fui-messages', ...colorClasses.value, props.class],
          style: [colorStyles.value, props.style],
          // Messages appear/disappear as the user types, so they are announced
          // politely rather than interrupting (role="alert" would).
          'aria-live': 'polite',
        },
        () =>
          props.active
            ? messages.value.map((message, i) =>
                h(
                  'div',
                  { class: 'fui-messages__message', key: `${i}-${message}` },
                  slots.message ? slots.message({ message }) : message
                )
              )
            : []
      )
    )
  },
})
