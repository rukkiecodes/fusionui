import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'

export const makeFSpacerProps = propsFactory({ ...makeComponentProps() }, 'FSpacer')

export const FSpacer = genericComponent()({
  name: 'FSpacer',
  props: makeFSpacerProps(),
  setup(props: any) {
    useRender(() => h('div', { class: ['fui-spacer', props.class], style: props.style }))
  },
})
