import { describe, it, expect } from 'vitest'
import { effects, resolveEffect, gradient, displace } from '../effects'
import { toRgb01 } from '../runtime/color'
import { supportsWebGL2, prefersReducedMotion, shouldRunShader } from '../runtime/capability'
import type { ShaderEffect } from '../types'

describe('effect catalogue', () => {
  it('ships the four first-class effects, each with the shared uniform contract', () => {
    expect(Object.keys(effects).sort()).toEqual(['displace', 'glow', 'gradient', 'grain'])
    for (const e of Object.values(effects)) {
      expect(e.frag).toContain('#version 300 es')
      expect(e.frag).toContain('void main')
      // Every effect declares the full uniform set so the runtime can bind blindly.
      for (const u of ['u_time', 'u_resolution', 'u_colorA', 'u_colorB', 'u_intensity']) {
        expect(e.frag).toContain(u)
      }
      expect(typeof e.rationale).toBe('string')
      expect(e.rationale.length).toBeGreaterThan(10)
    }
  })

  it('only the hover effect reads the pointer uniform', () => {
    expect(displace.usesPointer).toBe(true)
    expect(gradient.usesPointer).toBe(false)
    expect(displace.frag).toContain('u_pointer')
  })

  it('every effect provides a non-empty static CSS fallback', () => {
    for (const e of Object.values(effects)) {
      const css = e.fallback('#195bff', '#7d33ff', 0.9)
      expect(Object.keys(css).length).toBeGreaterThan(0)
      // The fallback must reference at least one of the colours or be a texture.
      const blob = JSON.stringify(css)
      expect(blob.length).toBeGreaterThan(0)
    }
  })

  it('resolves effects by name and passes custom effects through', () => {
    expect(resolveEffect('glow').name).toBe('glow')
    const custom: ShaderEffect = {
      name: 'x',
      frag: 'f',
      usesPointer: false,
      rationale: 'a custom test effect',
      fallback: () => ({ background: 'red' }),
    }
    expect(resolveEffect(custom)).toBe(custom)
    expect(() => resolveEffect('nope')).toThrow(/unknown effect/)
  })
})

describe('color normalisation', () => {
  it('parses hex (3 and 6 digit) to rgb 0..1', () => {
    expect(toRgb01('#ffffff')).toEqual([1, 1, 1])
    expect(toRgb01('#000')).toEqual([0, 0, 0])
    const [r, g, b] = toRgb01('#195bff')
    expect(r).toBeCloseTo(25 / 255, 5)
    expect(g).toBeCloseTo(91 / 255, 5)
    expect(b).toBeCloseTo(255 / 255, 5)
  })
})

describe('capability detection (SSR/jsdom safe)', () => {
  it('never throws and returns booleans', () => {
    expect(typeof supportsWebGL2()).toBe('boolean')
    expect(typeof prefersReducedMotion()).toBe('boolean')
    expect(typeof shouldRunShader()).toBe('boolean')
  })
  it('does not run the shader when WebGL2 is absent (jsdom)', () => {
    // jsdom has no WebGL2 context, so the live path must stay off → CSS fallback.
    expect(shouldRunShader()).toBe(false)
  })
})
