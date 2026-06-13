import { describe, it, expect, beforeAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  surfaceNormal,
  refractDisplacement,
  rasterizeGlassField,
  clampRadius,
} from '../engine/liquid-glass'
import { FGlass } from '../components/FGlass'
import { createTheme, ThemeSymbol } from '../composables/theme'

describe('liquid-glass engine', () => {
  it('plateau refracts to exactly (0,0) — the middle stays readable', () => {
    // Deep inside the slab (|d| > bezel): normal is +z, no bend.
    const n = surfaceNormal(-50, -1, 0, 18, 14, 'lens')
    // ±0 is mathematically zero; toBeCloseTo sidesteps signed-zero pedantry.
    expect(n.nx).toBeCloseTo(0, 10)
    expect(n.ny).toBeCloseTo(0, 10)
    expect(n.nz).toBe(1)
    const [dx, dy] = refractDisplacement(n.nx, n.ny, n.nz, 14, 1.45)
    expect(dx).toBeCloseTo(0, 10)
    expect(dy).toBeCloseTo(0, 10)
  })

  it('rim refraction matches convex-lens optics (samples inward at the edge)', () => {
    // Right edge: SDF gradient points +x (outward). A converging lens bends the
    // view ray so the rim samples the backdrop from further toward center → the
    // x-displacement is negative on the right edge and positive on the left.
    const right = surfaceNormal(-2, 1, 0, 18, 14, 'lens')
    const [rdx] = refractDisplacement(right.nx, right.ny, right.nz, 14, 1.45)
    expect(rdx).toBeLessThan(0)

    const left = surfaceNormal(-2, -1, 0, 18, 14, 'lens')
    const [ldx] = refractDisplacement(left.nx, left.ny, left.nz, 14, 1.45)
    expect(ldx).toBeGreaterThan(0)

    // The lens profile bends harder than the smooth profile at the same point.
    const lens = surfaceNormal(-2, 1, 0, 18, 14, 'lens')
    const smooth = surfaceNormal(-2, 1, 0, 18, 14, 'smooth')
    const lensMag = Math.abs(refractDisplacement(lens.nx, lens.ny, lens.nz, 14, 1.45)[0])
    const smoothMag = Math.abs(refractDisplacement(smooth.nx, smooth.ny, smooth.nz, 14, 1.45)[0])
    expect(lensMag).toBeGreaterThan(smoothMag)
  })

  it('8-bit displacement map round-trips through the feDisplacementMap encoding', () => {
    const maps = rasterizeGlassField({ width: 120, height: 80, radius: 24 }, undefined, {
      scale: 1,
    })
    expect(maps.maxDisplacement).toBeGreaterThan(0)

    // feDisplacementMap computes offset = scaleAttr·(channel/255 − 0.5) with
    // scaleAttr = 2·maxDisplacement. The extreme channels must decode back to
    // ±maxDisplacement within sub-pixel rounding error.
    let minR = 255
    let maxR = 0
    for (let i = 0; i < maps.width * maps.height; i++) {
      const r = maps.displacement[i * 4]
      if (r < minR) minR = r
      if (r > maxR) maxR = r
    }
    const decode = (ch: number) => 2 * maps.maxDisplacement * (ch / 255 - 0.5)
    expect(decode(maxR)).toBeCloseTo(maps.maxDisplacement, 0)
    expect(decode(minR)).toBeCloseTo(-maps.maxDisplacement, 0)
  })

  it('clamps the corner radius to half the short side', () => {
    expect(clampRadius(100, 40, 999)).toBe(20)
    expect(clampRadius(100, 40, 8)).toBe(8)
  })
})

describe('FGlass component', () => {
  beforeAll(() => {
    // jsdom has no ResizeObserver; the composable observes resize for remaps.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
  })

  function mountGlass(props = {}) {
    const theme = createTheme()
    return mount(FGlass, {
      props,
      slots: { default: () => 'Frosted' },
      global: { provide: { [ThemeSymbol as symbol]: theme } },
    })
  }

  it('renders the glass surface with its highlight + content layers', () => {
    const w = mountGlass()
    expect(w.classes()).toContain('fui-glass')
    expect(w.find('.fui-glass__highlight').exists()).toBe(true)
    expect(w.find('.fui-glass__content').text()).toBe('Frosted')
  })

  it('exposes the interactive modifier and applies the corner radius', () => {
    const w = mountGlass({ interactive: true, radius: 30 })
    expect(w.classes()).toContain('fui-glass--interactive')
    expect(w.attributes('style')).toContain('border-radius: 30px')
  })
})
