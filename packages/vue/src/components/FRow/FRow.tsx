import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { convertToUnit } from '../../util/helpers'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeDensityProps } from '../../composables/density'

// Responsive breakpoints the align/justify props fan out to (xs is the base prop).
const BREAKPOINTS = ['', 'Sm', 'Md', 'Lg', 'Xl', 'Xxl'] as const

const ALIGNMENT = ['start', 'end', 'center'] as const
const SPACE = ['space-between', 'space-around', 'space-evenly'] as const

const ALIGN_VALUES = [...ALIGNMENT, 'baseline', 'stretch'] as const
const JUSTIFY_VALUES = [...ALIGNMENT, ...SPACE] as const
const ALIGN_CONTENT_VALUES = [...ALIGNMENT, ...SPACE, 'stretch'] as const

type Align = (typeof ALIGN_VALUES)[number]
type Justify = (typeof JUSTIFY_VALUES)[number]
type AlignContent = (typeof ALIGN_CONTENT_VALUES)[number]

const alignValidator = (v: any) => ALIGN_VALUES.includes(v)
const justifyValidator = (v: any) => JUSTIFY_VALUES.includes(v)
const alignContentValidator = (v: any) => ALIGN_CONTENT_VALUES.includes(v)

// { align: ['align','alignSm',…], justify: [...], alignContent: [...] }
const propMap = {
  align: BREAKPOINTS.map(bp => `align${bp}`),
  justify: BREAKPOINTS.map(bp => `justify${bp}`),
  alignContent: BREAKPOINTS.map(bp => `alignContent${bp}`),
} as const

const classMap = {
  align: 'align',
  justify: 'justify',
  alignContent: 'align-content',
} as const

// alignSm="center" → `fui-row--align-sm-center`; align="center" → `fui-row--align-center`.
function breakpointClass(
  type: keyof typeof classMap,
  prop: string,
  val: string | null
): string | undefined {
  if (val == null) return undefined
  let className = classMap[type]
  const breakpoint = prop.replace(type, '') // alignSm -> Sm ; align -> ''
  if (breakpoint) className += `-${breakpoint}`
  className += `-${val}`
  return `fui-row--${className.toLowerCase()}`
}

function alignProp(validator: (v: any) => boolean) {
  return { type: String as PropType<Align | Justify | AlignContent>, default: null, validator }
}

export const makeFRowProps = propsFactory(
  {
    /** Removes the gutter gap between columns. */
    noGutters: Boolean,
    /** Gutter override — one value for both axes, or `[x, y]`. Accepts px numbers or any CSS length. */
    gap: [Number, String, Array] as PropType<number | string | (number | string)[]>,
    /** Total columns the row is divided into (defaults to 12). */
    columns: [Number, String] as PropType<number | string>,

    // align-items, per breakpoint (align, alignSm … alignXxl)
    align: alignProp(alignValidator),
    alignSm: alignProp(alignValidator),
    alignMd: alignProp(alignValidator),
    alignLg: alignProp(alignValidator),
    alignXl: alignProp(alignValidator),
    alignXxl: alignProp(alignValidator),

    // justify-content, per breakpoint
    justify: alignProp(justifyValidator),
    justifySm: alignProp(justifyValidator),
    justifyMd: alignProp(justifyValidator),
    justifyLg: alignProp(justifyValidator),
    justifyXl: alignProp(justifyValidator),
    justifyXxl: alignProp(justifyValidator),

    // align-content, per breakpoint
    alignContent: alignProp(alignContentValidator),
    alignContentSm: alignProp(alignContentValidator),
    alignContentMd: alignProp(alignContentValidator),
    alignContentLg: alignProp(alignContentValidator),
    alignContentXl: alignProp(alignContentValidator),
    alignContentXxl: alignProp(alignContentValidator),

    ...makeDensityProps(),
    ...makeTagProps(),
    ...makeComponentProps(),
  },
  'FRow'
)

export const FRow = genericComponent()({
  name: 'FRow',
  props: makeFRowProps(),
  setup(props: any, { slots }: any) {
    const classes = computed(() => {
      const classList: any[] = []

      let type: keyof typeof propMap
      for (type in propMap) {
        propMap[type].forEach(prop => {
          const className = breakpointClass(type, prop, props[prop])
          if (className) classList.push(className)
        })
      }

      classList.push({
        'fui-row--no-gutters': props.noGutters,
        [`fui-row--density-${props.density}`]: !props.noGutters,
      })

      return classList
    })

    const horizontalGap = computed(() =>
      Array.isArray(props.gap) ? convertToUnit(props.gap[0] ?? 0) : convertToUnit(props.gap)
    )
    const verticalGap = computed(() =>
      Array.isArray(props.gap) ? convertToUnit(props.gap[1] ?? 0) : horizontalGap.value
    )

    useRender(() =>
      h(
        props.tag,
        {
          class: ['fui-row', classes.value, props.class],
          style: [
            {
              '--fui-col-gap-x': horizontalGap.value,
              '--fui-col-gap-y': verticalGap.value,
              '--fui-row-columns': props.columns,
            },
            props.style,
          ],
        },
        slots.default?.()
      )
    )
  },
})
