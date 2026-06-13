import { describe, expect, it } from 'vitest'
import { createTheme } from '../composables/theme'
import { createFusionUI } from '../index'

describe('theme engine', () => {
  it('generates rgb-triplet css variables from the palette', () => {
    const theme = createTheme()
    expect(theme.styles.value).toContain('--fui-theme-primary: 25,91,255')
    expect(theme.styles.value).toContain('--fui-theme-background: 255,255,255')
  })

  it('uses curated on-colors and auto-derives the rest', () => {
    const theme = createTheme()
    // curated: white on primary, dark on warning
    expect(theme.styles.value).toContain('--fui-theme-on-primary: 255,255,255')
    expect(theme.styles.value).toContain('--fui-theme-on-warning: 30,30,30')
    // curated blue-gray body text on light surfaces (Vuesax v4 #2c3e50)
    expect(theme.styles.value).toContain('--fui-theme-on-background: 44,62,80')
  })

  it('emits color utility classes that reference the variables', () => {
    const theme = createTheme()
    expect(theme.styles.value).toContain('.bg-primary')
    expect(theme.styles.value).toContain('background-color: rgb(var(--fui-theme-primary))')
    expect(theme.styles.value).toContain('.text-primary')
    expect(theme.styles.value).toContain('.border-primary')
  })

  it('wraps output in cascade layers', () => {
    const theme = createTheme()
    expect(theme.styles.value).toContain(
      '@layer fui-tokens, fui-theme, fui-base, fui-components, fui-utilities;'
    )
    expect(theme.styles.value).toContain('@layer fui-theme {')
    expect(theme.styles.value).toContain('@layer fui-utilities {')
  })

  it('change() and toggle() switch the active theme', () => {
    const theme = createTheme()
    expect(theme.name.value).toBe('light')
    expect(theme.isDark.value).toBe(false)

    theme.toggle()
    expect(theme.name.value).toBe('dark')
    expect(theme.isDark.value).toBe(true)

    theme.change('light')
    expect(theme.name.value).toBe('light')
    expect(theme.isDark.value).toBe(false)
  })

  it('honors a custom defaultTheme and ignores unknown themes', () => {
    const theme = createTheme({ defaultTheme: 'dark' })
    expect(theme.name.value).toBe('dark')
    theme.change('does-not-exist')
    expect(theme.name.value).toBe('dark')
  })

  it('injects a stylesheet and root class on install', () => {
    const fusionui = createFusionUI({ theme: { defaultTheme: 'dark' } })
    const app = { provide() {}, directive() {}, component() {}, mixin() {} } as never
    fusionui.theme.install(app)

    const style = document.getElementById('fusionui-theme-stylesheet')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('--fui-theme-primary')
    expect(document.documentElement.classList.contains('fui-theme--dark')).toBe(true)
  })
})
