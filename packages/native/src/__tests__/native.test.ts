import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lightTheme, darkTheme, shadowStyle } from '../theme/tokens'
import { makeGlassUniforms, surfaceNormal, refractDisplacement } from '../engine/liquid-glass'

const ROOT = dirname(fileURLToPath(import.meta.url))

describe('native theme tokens — cross-platform parity', () => {
  it('shares the exact web palette + token values (one source of truth)', () => {
    expect(lightTheme.colors.primary).toBe('#195bff')
    expect(lightTheme.colors.surface).toBe('#ffffff')
    expect(darkTheme.colors.surface).toBe('#26282c')
    expect(lightTheme.radius.md).toBe(12)
    expect(lightTheme.motion.duration.base).toBe(250) // milliseconds, RN-friendly
    expect(lightTheme.font.weight.medium).toBe('500')
  })

  it('maps a shadow token to an RN iOS + Android style object', () => {
    const s = shadowStyle(lightTheme.shadowRest, 3)
    expect(s.shadowColor).toBe('#000000')
    expect(s.shadowOffset).toEqual({ width: 0, height: 5 })
    expect(s.shadowOpacity).toBeCloseTo(0.05, 6)
    expect(s.shadowRadius).toBe(10) // blur / 2
    expect(s.elevation).toBe(3)
  })
})

describe('native liquid-glass engine — shared math with web', () => {
  it('builds the SKSL uniform contract', () => {
    const u = makeGlassUniforms({ width: 200, height: 120, radius: 24 })
    expect(u.u_size).toEqual([200, 120])
    expect(u.u_radius).toBe(24)
    expect(u.u_profile).toBe(0) // lens
    expect(Array.isArray(u.u_light)).toBe(true)
    expect((u.u_spec as number[]).length).toBe(2)
  })

  it('plateau refracts to zero — the readable centre, same as web', () => {
    const n = surfaceNormal(-50, -1, 0, 18, 14, 'lens')
    const [dx, dy] = refractDisplacement(n.nx, n.ny, n.nz, 14, 1.45)
    expect(dx).toBeCloseTo(0, 10)
    expect(dy).toBeCloseTo(0, 10)
  })
})

describe('component API parity with @fusionui/vue', () => {
  it('FButton variants are a documented subset of the web allowedVariants', () => {
    const webSrc = readFileSync(join(ROOT, '../../../vue/src/composables/variant.ts'), 'utf8')
    const block = webSrc.match(/allowedVariants[^=]*=\s*\[([^\]]+)\]/)![1]
    const webVariants = [...block.matchAll(/'([a-z-]+)'/g)].map(m => m[1])

    const nativeSrc = readFileSync(join(ROOT, '../components/FButton.tsx'), 'utf8')
    const union = nativeSrc.match(/FButtonVariant\s*=\s*([^\n]+)/)![1]
    const nativeVariants = [...union.matchAll(/'([a-z-]+)'/g)].map(m => m[1])

    expect(nativeVariants.length).toBeGreaterThan(0)
    for (const v of nativeVariants) expect(webVariants).toContain(v)
  })
})
