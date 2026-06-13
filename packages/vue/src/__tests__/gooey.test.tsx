import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { makeKernelCache, fieldAt, GooSystem, SoftBody, type GooKernel } from '../engine/gooey'
import { FGoo } from '../components/FGoo'
import { createTheme, ThemeSymbol } from '../composables/theme'

describe('gooey field calibration', () => {
  // A lone blob's isosurface must land exactly on its visual radius `r` at the
  // active threshold — for every kernel. That's what decouples blob size from
  // merge reach.
  const kernels: GooKernel[] = ['cubic', 'gaussian', 'inverseSquare']
  for (const kernel of kernels) {
    it(`lone-blob isosurface equals its radius (${kernel})`, () => {
      const threshold = 0.5
      const cache = makeKernelCache(kernel, threshold)
      const blob = { x: 0, y: 0, vx: 0, vy: 0, r: 40 }
      // Field at exactly r should equal the threshold (the surface passes here).
      expect(fieldAt(40, 0, [blob], cache)).toBeCloseTo(threshold, 5)
      // Inside the radius the field is higher; outside it is lower.
      expect(fieldAt(20, 0, [blob], cache)).toBeGreaterThan(threshold)
      expect(fieldAt(60, 0, [blob], cache)).toBeLessThan(threshold)
    })
  }
})

describe('gooey merge (marching squares loop count)', () => {
  function loops(blobs: { x: number; y: number; r: number }[]) {
    const sys = new GooSystem(
      blobs.map(b => ({ ...b, vx: 0, vy: 0, pinned: true })),
      { field: { kernel: 'cubic', threshold: 0.5 } }
    )
    sys.setBounds(400, 200)
    const path = sys.toPath(4, 0)
    // Each closed contour starts with an SVG "M" command.
    return (path.match(/M/gi) || []).length
  }

  it('two overlapping blobs bridge into one contour', () => {
    expect(
      loops([
        { x: 180, y: 100, r: 40 },
        { x: 220, y: 100, r: 40 },
      ])
    ).toBe(1)
  })

  it('two well-separated blobs stay as two contours', () => {
    expect(
      loops([
        { x: 90, y: 100, r: 30 },
        { x: 320, y: 100, r: 30 },
      ])
    ).toBe(2)
  })
})

describe('gooey soft body', () => {
  it('holds its rest area at rest and stays finite under a poke', () => {
    const drop = new SoftBody({ cx: 130, cy: 120, radius: 60 })
    expect(drop.area() / drop.restArea).toBeCloseTo(1, 1)

    drop.poke(130, 70, -1500, 80)
    let min = Infinity
    let max = -Infinity
    for (let i = 0; i < 240; i++) {
      drop.step(1 / 60)
      const ratio = drop.area() / drop.restArea
      expect(Number.isFinite(ratio)).toBe(true)
      min = Math.min(min, ratio)
      max = Math.max(max, ratio)
    }
    // Deforms under the poke but preserves volume within a sane band…
    expect(min).toBeGreaterThan(0.6)
    expect(max).toBeLessThan(1.4)
    // …and settles back toward its rest area.
    expect(drop.area() / drop.restArea).toBeCloseTo(1, 0)
  })
})

describe('FGoo component', () => {
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
    vi.stubGlobal('requestAnimationFrame', () => 0)
    vi.stubGlobal('cancelAnimationFrame', () => {})
  })

  it('renders an svg goo surface with the mode modifier', () => {
    const theme = createTheme()
    const w = mount(FGoo, {
      props: { count: 5, mode: 'contour' },
      global: { provide: { [ThemeSymbol as symbol]: theme } },
    })
    expect(w.classes()).toContain('fui-goo')
    expect(w.classes()).toContain('fui-goo--contour')
    expect(w.find('svg.fui-goo__svg').exists()).toBe(true)
  })
})
