import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'

export const makeVdSpacerProps = propsFactory({ ...makeComponentProps() }, 'FSpacer')

export const FSpacer = genericComponent()({
  name: 'FSpacer',
  props: makeVdSpacerProps(),
  setup(props: any) {
    useRender(() => h('div', { class: ['fui-spacer', props.class], style: props.style }))
  },
})
