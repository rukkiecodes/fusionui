import { computed, h, nextTick, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { isCssColor } from '../../util/colors'
import {
  area,
  barPath,
  bars,
  curves,
  extent,
  line,
  pathToSvg,
  scaleBand,
  scaleLinear,
} from '../../engine/chart'
import type { Point } from '../../engine/chart'

/**
 * FSparkline — a word-sized chart. It draws one series with no axes, no grid
 * and no legend, meant to sit inside a stat card, a table cell or a sentence.
 *
 * It is not a second chart engine: the geometry comes from the same
 * `engine/chart` primitives FLineChart uses (scaleLinear/scaleBand → line/area/
 * bars → pathToSvg), so a sparkline and a full chart of the same data agree
 * down to the pixel.
 */

export interface FSparklinePoint {
  value: number
  label?: string
}

export type FSparklineItem = number | FSparklinePoint

// Counter, not Math.random: server and client must emit the same gradient id.
let gradUid = 0

export const makeFSparklineProps = propsFactory(
  {
    modelValue: { type: Array as PropType<FSparklineItem[]>, default: () => [] },
    type: { type: String as PropType<'trend' | 'bar'>, default: 'trend' },
    /** Trend: curve the line. Bar: round the caps (`true` = 2, or a radius). */
    smooth: {
      type: [Boolean, Number, String] as PropType<boolean | number | string>,
      default: false,
    },
    /** Fill the area under a trend line. */
    fill: Boolean,
    /** Stops from the far end of `gradient-direction` back to the near end. */
    gradient: { type: Array as PropType<string[]>, default: () => [] },
    gradientDirection: {
      type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
      default: 'top',
      validator: (v: unknown) => ['top', 'bottom', 'left', 'right'].includes(v as string),
    },
    /** Stroke width (trend) or bar width (bar), in viewBox units. */
    lineWidth: { type: [Number, String] as PropType<number | string>, default: 4 },
    /** Draw the series in on mount and whenever the data changes. */
    autoDraw: Boolean,
    autoDrawDuration: { type: [Number, String] as PropType<number | string>, default: 0 },
    autoDrawEasing: { type: String as PropType<string>, default: 'ease' },
    showLabels: Boolean,
    labelSize: { type: [Number, String] as PropType<number | string>, default: 7 },
    color: String as PropType<string>,
    width: { type: [Number, String] as PropType<number | string>, default: 300 },
    height: { type: [Number, String] as PropType<number | string>, default: 75 },
    padding: { type: [Number, String] as PropType<number | string>, default: 8 },
    min: [Number, String] as PropType<number | string>,
    max: [Number, String] as PropType<number | string>,
    /** Accessible name. The chart is `role="img"`; give it one unless decorative. */
    ariaLabel: String as PropType<string>,
    /** The data is already conveyed elsewhere — hide this from assistive tech. */
    decorative: Boolean,
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSparkline'
)

export const FSparkline = genericComponent<{
  label: (props: { index: number; value: string }) => any
}>()({
  name: 'FSparkline',
  props: makeFSparklineProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)

    const gradId = `fui-sparkline-grad-${++gradUid}`
    const strokeRef = ref<SVGPathElement | null>(null)
    const drawRef = ref<SVGGElement | null>(null)

    const items = computed<FSparklinePoint[]>(() =>
      (props.modelValue as FSparklineItem[]).map(item =>
        typeof item === 'number'
          ? { value: item }
          : { value: Number(item?.value ?? 0), label: item?.label }
      )
    )
    const values = computed(() => items.value.map(i => i.value))

    const width = computed(() => num(props.width, 300))
    const height = computed(() => num(props.height, 75))
    const padding = computed(() => num(props.padding, 0))
    const labelSize = computed(() => num(props.labelSize, 7))
    const lineWidth = computed(() => num(props.lineWidth, 4))

    const hasLabels = computed(() => props.showLabels && items.value.length > 0)
    /** Labels live below the plot, so the viewBox grows to make room. */
    const totalHeight = computed(() => height.value + (hasLabels.value ? labelSize.value * 1.5 : 0))

    const smoothing = computed(() => {
      const s = props.smooth
      if (s === false || s == null || s === '') return 0
      if (s === true) return 2
      const n = parseFloat(String(s))
      return Number.isFinite(n) ? n : 0
    })

    const domain = computed<[number, number]>(() => {
      const vals = values.value
      if (!vals.length) return [0, 1]
      let [lo, hi] = extent(vals)
      if (props.min != null && props.min !== '') lo = Number(props.min)
      if (props.max != null && props.max !== '') hi = Number(props.max)
      // Bars are read against a zero baseline; a bar chart floating off zero lies.
      if (props.type === 'bar') {
        if (props.min == null || props.min === '') lo = Math.min(lo, 0)
        if (props.max == null || props.max === '') hi = Math.max(hi, 0)
      }
      if (lo === hi) {
        lo -= 1
        hi += 1
      }
      return [lo, hi]
    })

    // ---- trend --------------------------------------------------------------

    const trendPoints = computed<Point[]>(() => {
      const n = values.value.length
      if (!n) return []
      const y = scaleLinear(domain.value, [height.value - padding.value, padding.value])
      const x = scaleLinear([0, Math.max(1, n - 1)], [padding.value, width.value - padding.value])
      // A single sample has no run to draw across — stretch it into a flat line.
      if (n === 1) {
        const yy = y(values.value[0])
        return [
          [padding.value, yy],
          [width.value - padding.value, yy],
        ]
      }
      return values.value.map((v, i) => [x(i), y(v)] as Point)
    })

    const curve = computed(() => (smoothing.value > 0 ? curves.monotone : curves.linear))

    const linePath = computed(() =>
      trendPoints.value.length ? pathToSvg(line(trendPoints.value, { curve: curve.value })) : ''
    )

    const fillPath = computed(() => {
      if (!props.fill || !trendPoints.value.length) return ''
      const baseline = trendPoints.value.map(p => [p[0], height.value] as Point)
      return pathToSvg(area(trendPoints.value, baseline, { curve: curve.value }))
    })

    // ---- bars ---------------------------------------------------------------

    const barPaths = computed<string[]>(() => {
      if (props.type !== 'bar' || !values.value.length) return []
      const data = values.value.map((value, key) => ({ key, value }))
      const band = scaleBand(
        data.map(d => d.key),
        [0, width.value]
      )
      const slot = band.bandwidth()
      const barWidth = Math.max(1, Math.min(lineWidth.value, slot))
      const inset = (slot - barWidth) / 2

      const y = scaleLinear(domain.value, [height.value, 0])
      const [lo, hi] = domain.value
      const zero = Math.min(Math.max(0, lo), hi)

      return bars(data, k => (band(k) ?? 0) + inset, barWidth, y, y(zero)).map(b =>
        pathToSvg(barPath(b, smoothing.value))
      )
    })

    // ---- paint --------------------------------------------------------------

    const resolvedColor = computed(() => {
      const color = props.color
      if (!color) return 'rgb(var(--fui-theme-primary))'
      return isCssColor(color) ? color : `rgb(var(--fui-theme-${color}))`
    })

    const stops = computed(() => {
      const list: string[] = (props.gradient as string[]).length
        ? (props.gradient as string[]).slice().reverse()
        : ['']
      const last = Math.max(list.length - 1, 1)
      return list.map((color, i) => ({ offset: i / last, color: color || 'currentColor' }))
    })

    const gradientCoords = computed(() => ({
      x1: props.gradientDirection === 'left' ? '100%' : '0%',
      y1: props.gradientDirection === 'top' ? '100%' : '0%',
      x2: props.gradientDirection === 'right' ? '100%' : '0%',
      y2: props.gradientDirection === 'bottom' ? '100%' : '0%',
    }))

    const paint = computed(() => `url(#${gradId})`)

    const labels = computed(() => {
      if (!hasLabels.value) return []
      if (props.type === 'bar') {
        const n = values.value.length
        const band = scaleBand(
          values.value.map((_, i) => i),
          [0, width.value]
        )
        return items.value.map((item, i) => ({
          x: (band(i) ?? 0) + band.bandwidth() / 2,
          value: item.label ?? String(item.value),
          index: i,
          n,
        }))
      }
      return items.value.map((item, i) => ({
        x: trendPoints.value[i]?.[0] ?? 0,
        value: item.label ?? String(item.value),
        index: i,
        n: items.value.length,
      }))
    })

    /** Fallback name so a chart is never announced as an unlabelled image. */
    const accessibleName = computed(() => {
      if (props.ariaLabel) return props.ariaLabel
      const vals = values.value
      if (!vals.length) return 'Sparkline, no data'
      const kind = props.type === 'bar' ? 'Bar sparkline' : 'Trend sparkline'
      return `${kind}, ${vals.length} values from ${vals[0]} to ${vals[vals.length - 1]}`
    })

    // ---- auto-draw ----------------------------------------------------------

    const drawDuration = computed(() => {
      const d = num(props.autoDrawDuration, 0)
      if (d > 0) return d
      // A bare stroke traces; a filled shape wipes up — the wipe wants less time.
      return props.type === 'trend' && !props.fill ? 2000 : 500
    })

    function prefersReducedMotion(): boolean {
      return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
    }

    /**
     * Draws the series in. Under `prefers-reduced-motion` this is a no-op and the
     * final geometry — which is what the `d` attribute already holds — just shows.
     */
    function runAutoDraw(): void {
      if (!props.autoDraw || typeof window === 'undefined' || prefersReducedMotion()) return

      const duration = drawDuration.value
      const easing = props.autoDrawEasing
      const stroke = strokeRef.value

      if (props.type === 'trend' && !props.fill && stroke) {
        // jsdom has no getTotalLength; there is nothing to animate there anyway.
        const length = typeof stroke.getTotalLength === 'function' ? stroke.getTotalLength() : 0
        if (!length) return

        stroke.style.transition = 'none'
        stroke.style.strokeDasharray = String(length)
        stroke.style.strokeDashoffset = String(length)
        void stroke.getBoundingClientRect()
        stroke.style.transition = `stroke-dashoffset ${duration}ms ${easing}`
        stroke.style.strokeDashoffset = '0'
        stroke.addEventListener(
          'transitionend',
          () => {
            stroke.style.transition = ''
            stroke.style.strokeDasharray = ''
            stroke.style.strokeDashoffset = ''
          },
          { once: true }
        )
        return
      }

      const layer = drawRef.value
      if (!layer) return
      layer.style.transition = 'none'
      layer.style.transformBox = 'fill-box'
      layer.style.transformOrigin = 'bottom center'
      layer.style.transform = 'scaleY(0)'
      void layer.getBoundingClientRect()
      layer.style.transition = `transform ${duration}ms ${easing}`
      layer.style.transform = 'scaleY(1)'
      layer.addEventListener(
        'transitionend',
        () => {
          layer.style.transition = ''
          layer.style.transform = ''
          layer.style.transformBox = ''
          layer.style.transformOrigin = ''
        },
        { once: true }
      )
    }

    onMounted(runAutoDraw)
    watch(
      () => props.modelValue,
      async () => {
        await nextTick()
        runAutoDraw()
      }
    )

    // ---- render -------------------------------------------------------------

    useRender(() => {
      const isBar = props.type === 'bar'

      return h(
        'svg',
        {
          class: ['fui-sparkline', `fui-sparkline--${props.type}`, props.class],
          style: [{ color: resolvedColor.value }, props.style],
          viewBox: `0 0 ${width.value} ${totalHeight.value}`,
          preserveAspectRatio: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          role: props.decorative ? undefined : 'img',
          'aria-hidden': props.decorative ? 'true' : undefined,
          'aria-label': props.decorative ? undefined : accessibleName.value,
        },
        [
          props.decorative ? null : h('title', accessibleName.value),
          h('defs', [
            h(
              'linearGradient',
              { id: gradId, gradientUnits: 'objectBoundingBox', ...gradientCoords.value },
              stops.value.map((s, i) =>
                h('stop', { key: i, offset: s.offset, 'stop-color': s.color })
              )
            ),
          ]),

          hasLabels.value
            ? h(
                'g',
                { key: 'labels', class: 'fui-sparkline__labels' },
                labels.value.map(label =>
                  h(
                    'text',
                    {
                      key: label.index,
                      class: 'fui-sparkline__label',
                      x: label.x,
                      y: totalHeight.value - labelSize.value * 0.25,
                      'font-size': labelSize.value,
                    },
                    slots.label?.({ index: label.index, value: label.value }) ?? label.value
                  )
                )
              )
            : null,

          isBar
            ? h(
                'g',
                { key: 'bars', ref: drawRef, class: 'fui-sparkline__bars', fill: paint.value },
                barPaths.value.map((d, i) => h('path', { key: i, class: 'fui-sparkline__bar', d }))
              )
            : h('g', { key: 'trend', ref: drawRef, class: 'fui-sparkline__trend' }, [
                props.fill && fillPath.value
                  ? h('path', {
                      key: 'fill',
                      class: 'fui-sparkline__fill',
                      d: fillPath.value,
                      fill: paint.value,
                    })
                  : null,
                linePath.value
                  ? h('path', {
                      key: 'line',
                      ref: strokeRef,
                      class: 'fui-sparkline__line',
                      d: linePath.value,
                      fill: 'none',
                      stroke: props.fill ? 'currentColor' : paint.value,
                      'stroke-width': lineWidth.value,
                    })
                  : null,
              ]),
        ]
      )
    })

    return {}
  },
})

function num(value: unknown, fallback: number): number {
  const n = parseFloat(String(value ?? ''))
  return Number.isFinite(n) ? n : fallback
}

export type FSparkline = InstanceType<typeof FSparkline>
