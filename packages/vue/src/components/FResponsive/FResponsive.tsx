import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'

export const makeFResponsiveProps = propsFactory(
  {
    /** `16/9`, `1.777…`, or any CSS `aspect-ratio` value. */
    aspectRatio: [String, Number] as PropType<string | number>,
    contentClass: [String, Array, Object] as PropType<unknown>,
    ...makeDimensionProps(),
    ...makeComponentProps(),
  },
  'FResponsive'
)

/**
 * Holds its content at a fixed aspect ratio, reserving the space before the
 * content loads — which is what keeps images and embeds from shifting the layout
 * as they arrive. It is the box `FImage` is built on.
 */
export const FResponsive = genericComponent()({
  name: 'FResponsive',
  props: makeFResponsiveProps(),
  setup(props: any, { slots }: any) {
    const { dimensionStyles } = useDimension(props)

    const ratio = computed(() => {
      const value = props.aspectRatio
      if (value == null || value === '') return undefined
      // A bare number ("1.5") is a valid CSS aspect-ratio; so is "16/9".
      return String(value)
    })

    useRender(() =>
      h(
        'div',
        {
          class: ['fui-responsive', props.class],
          style: [dimensionStyles.value, props.style],
        },
        [
          h(
            'div',
            {
              class: ['fui-responsive__content', props.contentClass],
              style: { aspectRatio: ratio.value },
            },
            slots.default?.()
          ),
          slots.additional?.(),
        ]
      )
    )
  },
})
