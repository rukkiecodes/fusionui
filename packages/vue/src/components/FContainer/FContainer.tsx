import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'

export const makeFContainerProps = propsFactory(
  {
    /** Fills the full width at every breakpoint instead of capping at the centered max-widths. */
    fluid: Boolean,
    ...makeDimensionProps(),
    ...makeTagProps(),
    ...makeComponentProps(),
  },
  'FContainer'
)

export const FContainer = genericComponent()({
  name: 'FContainer',
  props: makeFContainerProps(),
  setup(props: any, { slots }: any) {
    const { dimensionStyles } = useDimension(props)

    useRender(() =>
      h(
        props.tag,
        {
          class: ['fui-container', { 'fui-container--fluid': props.fluid }, props.class],
          style: [dimensionStyles.value, props.style],
        },
        slots.default?.()
      )
    )
  },
})
