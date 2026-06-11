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
  'VdTooltip'
)

export const VdTooltip = genericComponent()({
  name: 'VdTooltip',
  props: makeVdTooltipProps(),
  setup(props: any, { slots }: any) {
    const isActive = ref(false)

    useRender(() =>
      h(
        'span',
        {
          class: ['vd-tooltip', props.class],
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
                  class: ['vd-tooltip__content', `vd-tooltip__content--${props.location}`],
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
