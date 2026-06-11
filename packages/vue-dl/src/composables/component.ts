import { propsFactory } from '../util/propsFactory'

/** Pass-through `class` / `style` props every component accepts. */
export const makeComponentProps = propsFactory(
  {
    class: [String, Array, Object],
    style: {
      type: [String, Array, Object],
      default: null,
    },
  },
  'component'
)

/** `tag` prop for components that can render as different elements. */
export const makeTagProps = propsFactory(
  {
    tag: {
      type: String,
      default: 'div',
    },
  },
  'tag'
)
