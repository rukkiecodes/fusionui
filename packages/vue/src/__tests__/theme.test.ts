import { describe, expect, it } from 'vitest'
import { createTheme } from '../composables/theme'
import { createVueDL } from '../index'

describe('theme engine', () => {
  it('generates rgb-triplet css variables from the palette', () => {
    const theme = createTheme()
    expect(theme.styles.value).toContain('--vd-theme-primary: 25,91,255')
    expect(theme.styles.value).toContain('--vd-theme-background: 255,255,255')
  })

  it('uses curated on-colors and auto-derives the rest', () => {
    const theme = createTheme()
    // curated: white on primary, dark on warning
    expect(theme.styles.value).toContain('--vd-theme-on-primary: 255,255,255')
    expect(theme.styles.value).toContain('--vd-theme-on-warning: 30,30,30')
    // curated blue-gray body text on light surfaces (Vuesax v4 #2c3e50)
    expect(theme.styles.value).toContain('--vd-theme-on-background: 44,62,80')
  })

  it('emits color utility classes that reference the variables', () => {
    const theme = createTheme()
    expect(theme.styles.value).toContain('.bg-primary')
    expect(theme.styles.value).toContain('background-color: rgb(var(--vd-theme-primary))')
    expect(theme.styles.value).toContain('.text-primary')
    expect(theme.styles.value).toContain('.border-primary')
  })

  it('wraps output in cascade layers', () => {
    const theme = createTheme()
    expect(theme.styles.value).toContain(
      '@layer vd-tokens, vd-theme, vd-base, vd-components, vd-utilities;'
    )
    expect(theme.styles.value).toContain('@layer vd-theme {')
    expect(theme.styles.value).toContain('@layer vd-utilities {')
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
    const vuedl = createVueDL({ theme: { defaultTheme: 'dark' } })
    const app = { provide() {}, directive() {}, component() {}, mixin() {} } as never
    vuedl.theme.install(app)

    const style = document.getElementById('vue-dl-theme-stylesheet')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('--vd-theme-primary')
    expect(document.documentElement.classList.contains('vd-theme--dark')).toBe(true)
  })
})
