import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'

type ColValue = boolean | string | number
type SpanValue = string | number

// Responsive props: `cols` is the xs-and-up base; sm…xxl narrow it per breakpoint.
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', 'xxl'] as const

const ALIGN_SELF_VALUES = ['auto', 'start', 'end', 'center', 'baseline', 'stretch'] as const
const alignSelfValidator = (v: any) => ALIGN_SELF_VALUES.includes(v)

const colProp = () => ({ type: [Boolean, String, Number] as PropType<ColValue>, default: false })
const spanProp = () => ({ type: [String, Number] as PropType<SpanValue>, default: null })

// { col: ['sm',…], offset: ['offsetSm',…], order: ['orderSm',…] }
const propMap = {
  col: [...BREAKPOINTS],
  offset: BREAKPOINTS.map(bp => `offset${cap(bp)}`),
  order: BREAKPOINTS.map(bp => `order${cap(bp)}`),
} as const

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// `cols="4/6"` → span 4 of a 6-column total (the `/size` overrides --fui-row-columns).
function parseCols(val: ColValue): { cols: ColValue; size?: number } {
  if (typeof val === 'string' && val.includes('/')) {
    const [cols, size] = val.split('/')
    return { cols: Number(cols), size: Number(size) }
  }
  return { cols: val }
}

function parseBreakpoint(type: keyof typeof propMap, prop: string, val: ColValue) {
  if (val == null || val === false) return {}
  const { cols, size } = parseCols(val)
  const bp = prop.replace(type, '').toLowerCase() // offsetSm -> sm ; sm -> sm

  if (type === 'offset') {
    return {
      className: `fui-col--offset-${bp}-${cols}`,
      variables: [{ [`--fui-col-offset-base-${bp}`]: size }],
    }
  }
  if (type === 'order') {
    return { className: `fui-col--order-${bp}-${cols}` }
  }
  // Bare boolean (`<f-col sm>`) means equal-width at that breakpoint; else a span.
  return {
    className: cols === '' || cols === true ? `fui-col--${bp}` : `fui-col--cols-${bp}-${cols}`,
    variables: [{ [`--fui-col-size-base-${bp}`]: size }],
  }
}

export const makeFColProps = propsFactory(
  {
    /** Column span (1–12), `"auto"` to fit content, or `"n/total"` for a custom total. Falsy = equal-width fill. */
    cols: colProp(),
    /** Span from the sm breakpoint up. */
    sm: colProp(),
    /** Span from the md breakpoint up. */
    md: colProp(),
    /** Span from the lg breakpoint up. */
    lg: colProp(),
    /** Span from the xl breakpoint up. */
    xl: colProp(),
    /** Span from the xxl breakpoint up. */
    xxl: colProp(),

    /** Columns to offset (push right by) from the left. */
    offset: spanProp(),
    offsetSm: spanProp(),
    offsetMd: spanProp(),
    offsetLg: spanProp(),
    offsetXl: spanProp(),
    offsetXxl: spanProp(),

    /** Flex order — a number, or `"first"` / `"last"`. */
    order: spanProp(),
    orderSm: spanProp(),
    orderMd: spanProp(),
    orderLg: spanProp(),
    orderXl: spanProp(),
    orderXxl: spanProp(),

    /** Cross-axis self alignment: auto, start, end, center, baseline, stretch. */
    alignSelf: {
      type: String as PropType<(typeof ALIGN_SELF_VALUES)[number]>,
      default: null,
      validator: alignSelfValidator,
    },

    ...makeTagProps(),
    ...makeComponentProps(),
  },
  'FCol'
)

export const FCol = genericComponent()({
  name: 'FCol',
  props: makeFColProps(),
  setup(props: any, { slots }: any) {
    // `/size` override for the base cols / offset (responsive ones ride CSS vars).
    const sizeBaseOverride = computed(() => parseCols(props.cols).size)
    const offsetBaseOverride = computed(() => parseCols(props.offset).size)

    const responsive = computed(() => {
      const classList: any[] = ['fui-col']
      const variablesList: any[] = []

      let type: keyof typeof propMap
      for (type in propMap) {
        propMap[type].forEach(prop => {
          const { className, variables } = parseBreakpoint(type, prop, props[prop])
          if (className) classList.push(className)
          if (variables) variablesList.push(...variables)
        })
      }

      const { cols } = parseCols(props.cols)
      const { cols: offset } = parseCols(props.offset)

      classList.push({
        // Bare/false base cols keep the default equal-width fill (no class).
        [`fui-col--cols-${cols}`]: cols && cols !== true && cols !== '',
        [`fui-col--offset-${offset}`]: offset,
        [`fui-col--order-${props.order}`]: props.order,
        [`fui-col--align-self-${props.alignSelf}`]: props.alignSelf,
      })

      return { classes: classList, variables: variablesList }
    })

    useRender(() =>
      h(
        props.tag,
        {
          class: [responsive.value.classes, props.class],
          style: [
            {
              '--fui-col-size-base': sizeBaseOverride.value,
              '--fui-col-offset-base': offsetBaseOverride.value,
            },
            responsive.value.variables,
            props.style,
          ],
        },
        slots.default?.()
      )
    )
  },
})
