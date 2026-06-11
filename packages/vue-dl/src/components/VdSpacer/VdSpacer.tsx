import { h } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'

export const makeVdSpacerProps = propsFactory({ ...makeComponentProps() }, 'VdSpacer')

export const VdSpacer = genericComponent()({
  name: 'VdSpacer',
  props: makeVdSpacerProps(),
  setup(props: any) {
    useRender(() => h('div', { class: ['vd-spacer', props.class], style: props.style }))
  },
})
