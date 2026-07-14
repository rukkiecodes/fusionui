import { defineComponent, h } from 'vue'
import { featherIcons } from './registry'

// Opt-in icon set that resolves Feather icons by string name (`<f-icon icon="bell" />`).
// Importing this pulls the full registry (all 2,270 icons). For tree-shaking,
// import individual icons instead: `<f-icon :icon="Bell" />`.
export const featherSet = {
  component: defineComponent({
    name: 'FFeatherIcon',
    props: {
      icon: { type: String, default: '' },
      tag: { type: String, default: 'i' },
    },
    setup(props) {
      return () => {
        const Icon = featherIcons[props.icon]
        return Icon ? h(Icon) : null
      }
    },
  }),
}
