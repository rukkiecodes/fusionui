import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { useChartDimensions } from '../../composables/chart'
import {
  scaleLinear,
  scalePoint,
  line,
  area,
  axisTicks,
  bandAxisTicks,
  extent,
  pathToSvg,
  curves,
} from '../../engine/chart'
import type { CurveName, Point } from '../../engine/chart'

/**
 * FLineChart — a REFERENCE component, not the engine. It shows the pattern:
 * measure → build scales → generate path commands with a curve → serialize to
 * SVG → draw axes from tick objects. Copy it as the starting point for your
 * own chart components (multi-series, tooltips, brushing, etc.).
 */

export interface LinePoint {
  x: number | string
  y: number
}

// Stable per-instance id for the area gradient — a counter, not Math.random, so
// server and client render identical markup (no hydration mismatch).
let gradUid = 0

export const makeFLineChartProps = propsFactory(
  {
    data: { type: Array as PropType<LinePoint[]>, default: () => [] },
    curve: { type: String as PropType<CurveName>, default: 'monotone' },
    /** Fill the area under the line. */
    area: Boolean,
    color: String,
    strokeWidth: { type: Number, default: 2 },
    /** Force the y domain to include zero. */
    zero: { type: Boolean, default: true },
    showGrid: { type: Boolean, default: true },
    showAxes: { type: Boolean, default: true },
    tickCount: { type: Number, default: 6 },
    /** Accessible text alternative for the chart (it conveys data). */
    label: { type: String, default: 'Line chart' },
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FLineChart'
)

export const FLineChart = genericComponent()({
  name: 'FLineChart',
  inheritAttrs: false,
  props: makeFLineChartProps(),
  setup(props: any, { attrs }: any) {
    provideTheme(props)
    const root = ref<HTMLElement | null>(null)
    const { dims } = useChartDimensions(root)

    const stroke = computed(() => props.color || 'rgb(var(--fui-theme-primary))')

    const model = computed(() => {
      const data: LinePoint[] = props.data
      const m = dims.margin
      if (!data.length || dims.innerWidth <= 0 || dims.innerHeight <= 0) {
        return { linePath: '', areaPath: '', xTicks: [], yTicks: [], m }
      }

      const x = scalePoint(
        data.map(d => d.x),
        [0, dims.innerWidth]
      )
      const yVals = data.map(d => d.y)
      let [y0, y1] = extent(yVals)
      if (props.zero) {
        y0 = Math.min(0, y0)
        y1 = Math.max(0, y1)
      }
      if (y0 === y1) {
        y0 -= 1
        y1 += 1
      }
      const y = scaleLinear([y0, y1], [dims.innerHeight, 0]).nice(props.tickCount)

      const bw = x.bandwidth()
      const px = (d: LinePoint): Point => [(x(d.x) ?? 0) + bw / 2, y(d.y)]
      const pts = data.map(px)
      const curve = curves[props.curve as CurveName] ?? curves.monotone

      const linePath = pathToSvg(line(pts, { curve }))
      const baseY = y(Math.max(y0, 0))
      const areaPath = props.area
        ? pathToSvg(
            area(
              pts,
              pts.map(p => [p[0], baseY] as Point),
              { curve }
            )
          )
        : ''

      const yTicks = axisTicks(y, props.tickCount)
      const xTicks = bandAxisTicks(x)
      return { linePath, areaPath, xTicks, yTicks, m }
    })

    const gradId = `fui-line-grad-${++gradUid}`

    useRender(() => {
      const { linePath, areaPath, xTicks, yTicks, m } = model.value
      return (
        <div
          ref={root}
          class={['fui-line-chart', props.class]}
          style={props.style}
          role="img"
          aria-label={props.label}
          {...attrs}
        >
          <svg class="fui-line-chart__svg" width="100%" height="100%" aria-hidden="true">
            <title>{props.label}</title>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color={stroke.value} stop-opacity="0.32" />
                <stop offset="1" stop-color={stroke.value} stop-opacity="0" />
              </linearGradient>
            </defs>
            <g transform={`translate(${m.left},${m.top})`}>
              {props.showGrid &&
                yTicks.map((t: any) => (
                  <line
                    key={`g${t.value}`}
                    class="fui-line-chart__grid"
                    x1={0}
                    x2={dims.innerWidth}
                    y1={t.position}
                    y2={t.position}
                  />
                ))}
              {props.area && areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={stroke.value}
                  stroke-width={props.strokeWidth}
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              )}
              {props.showAxes &&
                yTicks.map((t: any) => (
                  <text
                    key={`y${t.value}`}
                    class="fui-line-chart__label fui-line-chart__label--y"
                    x={-8}
                    y={t.position}
                    dy="0.32em"
                    text-anchor="end"
                  >
                    {t.label}
                  </text>
                ))}
              {props.showAxes &&
                xTicks.map((t: any, i: number) => (
                  <text
                    key={`x${i}`}
                    class="fui-line-chart__label fui-line-chart__label--x"
                    x={t.position}
                    y={dims.innerHeight + 18}
                    text-anchor="middle"
                  >
                    {t.label}
                  </text>
                ))}
            </g>
          </svg>
        </div>
      )
    })

    return {}
  },
})

export type FLineChart = InstanceType<typeof FLineChart>
