import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { useLayout } from '../../composables/layout'

export const makeFMainProps = propsFactory(
  {
    ...makeComponentProps(),
  },
  'FMain'
)

/**
 * The main content region. Insets itself by the accumulated size of every active
 * layout item (app bar height, drawer width, …) via the `--fui-layout-*` vars.
 */
export const FMain = genericComponent()({
  name: 'FMain',
  props: makeFMainProps(),
  setup(props: any, { slots }: any) {
    const { mainStyles } = useLayout()

    useRender(() =>
      h(
        'main',
        { class: ['fui-main', props.class], style: [mainStyles.value, props.style] },
        slots.default ? slots.default() : undefined
      )
    )
  },
})
