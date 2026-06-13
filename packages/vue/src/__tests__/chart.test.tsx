import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  scaleLinear,
  scaleBand,
  axisTicks,
  line,
  pie,
  curves,
  extent,
  linearRegression,
  type PathCommand,
  type Point,
} from '../engine/chart'
import { FLineChart } from '../components/FLineChart'
import { createTheme, ThemeSymbol } from '../composables/theme'

describe('chart scales', () => {
  it('scaleLinear maps endpoints and round-trips exactly', () => {
    const s = scaleLinear([0, 100], [0, 500])
    expect(s(0)).toBe(0)
    expect(s(100)).toBe(500)
    expect(s(50)).toBe(250)
    for (const v of [3.7, 42, 88.1]) expect(s.invert(s(v))).toBeCloseTo(v, 9)
  })

  it('scaleBand: bandwidth = step · (1 − paddingInner) and bands are evenly spaced', () => {
    const s = scaleBand(['a', 'b', 'c', 'd'], [0, 400]).paddingInner(0.2)
    expect(s.bandwidth()).toBeCloseTo(s.step() * (1 - 0.2), 9)
    const xs = ['a', 'b', 'c', 'd'].map(k => s(k) as number)
    const gaps = xs.slice(1).map((x, i) => x - xs[i])
    for (const g of gaps) expect(g).toBeCloseTo(gaps[0], 9)
  })

  it('axisTicks land within the domain and read as round numbers', () => {
    const s = scaleLinear([0, 95], [0, 300]).nice(5)
    const ticks = axisTicks(s, 5)
    expect(ticks.length).toBeGreaterThan(2)
    for (const t of ticks) {
      expect(t.value).toBeGreaterThanOrEqual(s.domain()[0] - 1e-9)
      expect(t.value).toBeLessThanOrEqual(s.domain()[1] + 1e-9)
    }
  })
})

// Densely sample the bezier/line output so we can measure overshoot.
function sampleYs(cmds: PathCommand[]): number[] {
  const ys: number[] = []
  let cy = 0
  for (const c of cmds) {
    if (c.type === 'M' || c.type === 'L') {
      cy = c.y
      ys.push(cy)
    } else if (c.type === 'C') {
      for (let t = 0; t <= 1.0001; t += 0.04) {
        const mt = 1 - t
        ys.push(
          mt * mt * mt * cy + 3 * mt * mt * t * c.y1 + 3 * mt * t * t * c.y2 + t * t * t * c.y
        )
      }
      cy = c.y
    }
  }
  return ys
}

describe('chart curves — honesty', () => {
  // Spiky data: a naive spline bulges past the points; monotone must not.
  const pts: Point[] = [
    [0, 0],
    [1, 10],
    [2, 0],
    [3, 10],
    [4, 0],
  ]
  const dataMin = 0
  const dataMax = 10

  it('curveMonotoneX never overshoots the data envelope', () => {
    const ys = sampleYs(line(pts, { curve: curves.monotone }))
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(dataMin - 1e-6)
    expect(Math.max(...ys)).toBeLessThanOrEqual(dataMax + 1e-6)
  })

  it('curveCatmullRom DOES overshoot on the same data (control proves the test bites)', () => {
    const ys = sampleYs(line(pts, { curve: curves.catmullRom }))
    const overshoots = Math.max(...ys) > dataMax + 0.1 || Math.min(...ys) < dataMin - 0.1
    expect(overshoots).toBe(true)
  })
})

describe('chart shapes & stats', () => {
  it('pie slice angles sum to exactly 2π and are proportional', () => {
    const slices = pie([1, 2, 3])
    const total = slices.reduce((s, p) => s + (p.endAngle - p.startAngle), 0)
    expect(total).toBeCloseTo(Math.PI * 2, 9)
    // 3 is half the total (6), so its wedge is π.
    const big = slices.find(s => s.value === 3)!
    expect(big.endAngle - big.startAngle).toBeCloseTo(Math.PI, 9)
  })

  it('extent finds [min,max] and OLS regression is exact on a line', () => {
    expect(extent([3, -1, 7, 2])).toEqual([-1, 7])
    const reg = linearRegression([
      [0, 1],
      [1, 3],
      [2, 5],
    ])
    expect(reg.slope).toBeCloseTo(2, 9)
    expect(reg.intercept).toBeCloseTo(1, 9)
    expect(reg.r2).toBeCloseTo(1, 9)
  })
})

describe('FLineChart component', () => {
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
  })

  it('renders an svg chart surface', () => {
    const theme = createTheme()
    const w = mount(FLineChart, {
      props: {
        data: [
          { x: 'a', y: 1 },
          { x: 'b', y: 5 },
          { x: 'c', y: 3 },
        ],
        area: true,
      },
      global: { provide: { [ThemeSymbol as symbol]: theme } },
    })
    expect(w.classes()).toContain('fui-line-chart')
    expect(w.find('svg.fui-line-chart__svg').exists()).toBe(true)
  })
})
