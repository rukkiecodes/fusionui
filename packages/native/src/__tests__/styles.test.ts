import { describe, it, expect } from 'vitest'
import { lightTheme } from '../theme/tokens'
import { resolveVariant, withAlpha } from '../styles/variant'
import { resolveBreakpoint, isBreakpointUp, BREAKPOINTS } from '../styles/breakpoints'
import { boxStyle } from '../styles/box'
import { motionTokens, pressMotion } from '../styles/motion'

describe('withAlpha', () => {
  it('turns a hex colour into rgba', () => {
    expect(withAlpha('#195bff', 0.14)).toBe('rgba(25, 91, 255, 0.14)')
    expect(withAlpha('#fff', 0.5)).toBe('rgba(255, 255, 255, 0.5)')
  })
  it('passes non-hex values through', () => {
    expect(withAlpha('transparent', 0.5)).toBe('transparent')
  })
})

describe('resolveVariant — mirrors the web variant meaning', () => {
  it('elevated fills with the colour and puts the on-colour on the text, with shadow', () => {
    const v = resolveVariant(lightTheme, { variant: 'elevated', color: 'primary' })
    expect(v.backgroundColor).toBe(lightTheme.colors.primary)
    expect(v.color).toBe(lightTheme.colors['on-primary'])
    expect(v.elevated).toBe(true)
    expect(v.borderWidth).toBe(0)
  })

  it('flat is a filled variant with no shadow', () => {
    const v = resolveVariant(lightTheme, { variant: 'flat', color: 'primary' })
    expect(v.backgroundColor).toBe(lightTheme.colors.primary)
    expect(v.elevated).toBe(false)
  })

  it('tonal tints the background and colours the text', () => {
    const v = resolveVariant(lightTheme, { variant: 'tonal', color: 'primary' })
    expect(v.backgroundColor).toBe(withAlpha(lightTheme.colors.primary, 0.14))
    expect(v.color).toBe(lightTheme.colors.primary)
    expect(v.elevated).toBe(false)
  })

  it('outlined has a transparent fill, a coloured border and coloured text', () => {
    const v = resolveVariant(lightTheme, { variant: 'outlined', color: 'danger' })
    expect(v.backgroundColor).toBe('transparent')
    expect(v.color).toBe(lightTheme.colors.danger)
    expect(v.borderColor).toBe(withAlpha(lightTheme.colors.danger, 0.42))
    expect(v.borderWidth).toBe(1)
  })

  it('text is transparent with coloured text and no border', () => {
    const v = resolveVariant(lightTheme, { variant: 'text', color: 'success' })
    expect(v.backgroundColor).toBe('transparent')
    expect(v.color).toBe(lightTheme.colors.success)
    expect(v.borderWidth).toBe(0)
  })

  it('falls back to surface/on-surface when no colour is given', () => {
    const bg = resolveVariant(lightTheme, { variant: 'elevated' })
    expect(bg.backgroundColor).toBe(lightTheme.colors.surface)
    expect(bg.color).toBe(lightTheme.colors['on-surface'])
    const fg = resolveVariant(lightTheme, { variant: 'text' })
    expect(fg.color).toBe(lightTheme.colors['on-surface'])
  })

  it('defaults to the elevated variant', () => {
    expect(resolveVariant(lightTheme, { color: 'primary' }).elevated).toBe(true)
  })
})

describe('resolveBreakpoint — same thresholds as the web tokens', () => {
  it('maps widths to the largest reached breakpoint', () => {
    expect(resolveBreakpoint(320)).toBe('xs')
    expect(resolveBreakpoint(BREAKPOINTS.sm)).toBe('sm')
    expect(resolveBreakpoint(BREAKPOINTS.md)).toBe('md')
    expect(resolveBreakpoint(BREAKPOINTS.lg)).toBe('lg')
    expect(resolveBreakpoint(BREAKPOINTS.xl + 100)).toBe('xl')
  })
  it('up() is inclusive of the current breakpoint', () => {
    expect(isBreakpointUp('md', 'sm')).toBe(true)
    expect(isBreakpointUp('md', 'md')).toBe(true)
    expect(isBreakpointUp('sm', 'lg')).toBe(false)
  })
})

describe('motion — derived from the shared motion tokens', () => {
  it('mirrors the web heartbeat (0.25s base, 0.15s fast)', () => {
    const m = motionTokens(lightTheme)
    expect(m.durationBase).toBe(250)
    expect(m.durationFast).toBe(150)
    expect(m.sink).toBe(3)
    expect(m.lift).toBe(-3)
  })
  it('press sinks + scales down at the fast duration', () => {
    const p = pressMotion(lightTheme)
    expect(p.pressedScale).toBe(0.97)
    expect(p.pressedTranslateY).toBe(lightTheme.motion.sink)
    expect(p.duration).toBe(150)
  })
  it('reduced motion collapses to no movement', () => {
    const p = pressMotion(lightTheme, true)
    expect(p.pressedScale).toBe(1)
    expect(p.pressedTranslateY).toBe(0)
    expect(p.duration).toBe(0)
  })
})

describe('boxStyle — utility props → RN style, from theme values', () => {
  it('maps spacing keys through the theme scale', () => {
    const s = boxStyle(lightTheme, { row: true, gap: 2, p: 4, radius: 'lg' })
    expect(s.flexDirection).toBe('row')
    expect(s.gap).toBe(lightTheme.space[2]) // 8
    expect(s.padding).toBe(lightTheme.space[4]) // 16
    expect(s.borderRadius).toBe(lightTheme.radius.lg) // 20
  })
  it('resolves a colour name for bg, and passes raw numbers through', () => {
    const s = boxStyle(lightTheme, { bg: 'primary', px: 12, align: 'center', justify: 'between' })
    expect(s.backgroundColor).toBe(lightTheme.colors.primary)
    expect(s.paddingHorizontal).toBe(12)
    expect(s.alignItems).toBe('center')
    expect(s.justifyContent).toBe('space-between')
  })
})
