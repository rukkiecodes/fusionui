import { h, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'

export const makeVdTooltipProps = propsFactory(
  {
    text: String as PropType<string>,
    location: {
      type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
      default: 'top',
    },
    ...makeComponentProps(),
  },
  'FTooltip'
)

export const FTooltip = genericComponent()({
  name: 'FTooltip',
  props: makeVdTooltipProps(),
  setup(props: any, { slots }: any) {
    const isActive = ref(false)

    useRender(() =>
      h(
        'span',
        {
          class: ['fui-tooltip', props.class],
          style: props.style,
          onMouseenter: () => {
            isActive.value = true
          },
          onMouseleave: () => {
            isActive.value = false
          },
          onFocusin: () => {
            isActive.value = true
          },
          onFocusout: () => {
            isActive.value = false
          },
        },
        [
          slots.activator?.({ props: {}, isActive: isActive.value }) ?? slots.default?.(),
          isActive.value
            ? h(
                'span',
                {
                  class: ['fui-tooltip__content', `fui-tooltip__content--${props.location}`],
                  role: 'tooltip',
                },
                slots.tooltip ? slots.tooltip() : props.text
              )
            : null,
        ]
      )
    )
  },
})
