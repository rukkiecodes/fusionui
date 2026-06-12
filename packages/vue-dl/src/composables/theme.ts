import { computed, inject, provide, ref } from 'vue'
import type { App, ComputedRef, InjectionKey, PropType, Ref } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { isLightColor, parseColor } from '../util/colors'

// Theme engine: generates `--vd-theme-*` CSS variables (RGB triplets so
// components can apply alpha), auto-derives `on-*` contrast colors, emits the
// color utility classes (`bg-*`, `text-*`, `border-*`) that useColor relies on,
// and wraps everything in cascade `@layer`s so consumer styles always win.

export interface ThemeDefinition {
  dark: boolean
  colors: Record<string, string>
  variables?: Record<string, string | number>
}

export interface ThemeOptions {
  defaultTheme?: string
  themes?: Record<string, ThemeDefinition>
}

export interface ThemeInstance {
  install: (app: App) => void
  name: Ref<string>
  current: ComputedRef<ThemeDefinition>
  themes: Ref<Record<string, ThemeDefinition>>
  themeClasses: ComputedRef<string>
  styles: ComputedRef<string>
  isDark: ComputedRef<boolean>
  change: (name: string) => void
  toggle: (themes?: [string, string]) => void
}

export const ThemeSymbol: InjectionKey<ThemeInstance> = Symbol.for('vuedl:theme')

const LAYER_ORDER = '@layer vd-tokens, vd-theme, vd-base, vd-components, vd-utilities;'
const STYLE_ID = 'vue-dl-theme-stylesheet'

// Variables that differ between light and dark surfaces (Vuesax v4 DNA).
// `surface-2` is the subtle gray fill used by inputs/selects (Vuesax gray-2).
const lightVariables: Record<string, string | number> = {
  'border-color': '#2c3e50',
  'border-opacity': 0.12,
  'high-emphasis-opacity': 0.92,
  'medium-emphasis-opacity': 0.6,
  'disabled-opacity': 0.38,
  'surface-2': '#f4f7f8',
  'surface-3': '#f0f3f4',
  'shadow-rest': '0 5px 20px 0 rgba(0, 0, 0, 0.05)',
}

const darkVariables: Record<string, string | number> = {
  'border-color': '#ffffff',
  'border-opacity': 0.16,
  'high-emphasis-opacity': 1,
  'medium-emphasis-opacity': 0.7,
  'disabled-opacity': 0.5,
  'surface-2': '#26282c',
  'surface-3': '#1c1e21',
  'shadow-rest': '0 5px 20px 0 rgba(0, 0, 0, 0.4)',
}

// Vuesax palette (see plans/03-theme-design-tokens.md). `on-*` colors are
// curated for the intended look; any color without one falls back to an
// auto-derived contrast color (see onColor).
const vuesaxLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#195bff',
    secondary: '#7d33ff',
    success: '#46c93a',
    danger: '#ff4757',
    warning: '#ffba00',
    dark: '#1e1e1e',
    light: '#f4f7f8',
    'on-background': '#2c3e50',
    'on-surface': '#2c3e50',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-success': '#ffffff',
    'on-danger': '#ffffff',
    'on-warning': '#1e1e1e',
    'on-light': '#2c3e50',
  },
  variables: lightVariables,
}

const vuesaxDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#1e2023',
    surface: '#26282c',
    primary: '#195bff',
    secondary: '#9b6bff',
    success: '#46c93a',
    danger: '#ff4757',
    warning: '#ffba00',
    dark: '#f4f7f8',
    light: '#2a2c30',
    'on-background': '#ffffff',
    'on-surface': '#ffffff',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-success': '#ffffff',
    'on-danger': '#ffffff',
    'on-warning': '#1e1e1e',
    'on-light': '#ffffff',
  },
  variables: darkVariables,
}

function colorToTriplet(value: string): string {
  const { r, g, b } = parseColor(value)
  return `${r},${g},${b}`
}

/** Derives a readable foreground color (black/white) for a given background. */
function onColor(value: string): string {
  return isLightColor(value) ? '0,0,0' : '255,255,255'
}

function genThemeVariables(theme: ThemeDefinition): string {
  const lines: string[] = []
  for (const [key, value] of Object.entries(theme.colors)) {
    // `on-*` colors are emitted alongside their base color below.
    if (key.startsWith('on-')) continue
    lines.push(`--vd-theme-${key}: ${colorToTriplet(value)};`)
    const onKey = `on-${key}`
    const onValue = theme.colors[onKey] ? colorToTriplet(theme.colors[onKey]) : onColor(value)
    lines.push(`--vd-theme-${onKey}: ${onValue};`)
  }
  for (const [key, value] of Object.entries(theme.variables ?? {})) {
    const cssValue =
      typeof value === 'string' && value.startsWith('#') ? colorToTriplet(value) : value
    lines.push(`--vd-${key}: ${cssValue};`)
  }
  return lines.join(' ')
}

function genColorUtilities(colorKeys: string[]): string {
  const out: string[] = []
  for (const key of colorKeys) {
    if (key.startsWith('on-')) continue
    out.push(
      `.bg-${key} { background-color: rgb(var(--vd-theme-${key})) !important; color: rgb(var(--vd-theme-on-${key})) !important; }`
    )
    out.push(`.text-${key} { color: rgb(var(--vd-theme-${key})) !important; }`)
    out.push(`.border-${key} { border-color: rgb(var(--vd-theme-${key})) !important; }`)
    out.push(`.text-on-${key} { color: rgb(var(--vd-theme-on-${key})) !important; }`)
  }
  return out.join('\n')
}

export function createTheme(options: ThemeOptions = {}): ThemeInstance {
  const themes = ref<Record<string, ThemeDefinition>>(
    options.themes ?? { light: vuesaxLight, dark: vuesaxDark }
  )
  const name = ref(options.defaultTheme ?? 'light')

  const current = computed<ThemeDefinition>(() => themes.value[name.value] ?? vuesaxLight)
  const isDark = computed(() => current.value.dark)
  const themeClasses = computed(() => `vd-theme--${name.value}`)

  const styles = computed(() => {
    const blocks: string[] = [LAYER_ORDER]
    const themeBlocks: string[] = []
    for (const [themeName, def] of Object.entries(themes.value)) {
      const selector =
        themeName === name.value ? `:root, .vd-theme--${themeName}` : `.vd-theme--${themeName}`
      themeBlocks.push(`${selector} { ${genThemeVariables(def)} }`)
    }
    blocks.push(`@layer vd-theme {\n${themeBlocks.join('\n')}\n}`)

    const colorKeys = Object.keys(current.value.colors)
    blocks.push(`@layer vd-utilities {\n${genColorUtilities(colorKeys)}\n}`)
    return blocks.join('\n')
  })

  function updateStyles(): void {
    if (typeof document === 'undefined') return
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      el.setAttribute('type', 'text/css')
      document.head.appendChild(el)
    }
    el.textContent = styles.value
  }

  function applyRootClass(): void {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    for (const themeName of Object.keys(themes.value)) {
      root.classList.toggle(`vd-theme--${themeName}`, themeName === name.value)
    }
  }

  function change(newName: string): void {
    if (!themes.value[newName]) return
    name.value = newName
    updateStyles()
    applyRootClass()
  }

  function toggle(pair: [string, string] = ['light', 'dark']): void {
    change(name.value === pair[0] ? pair[1] : pair[0])
  }

  function install(_app: App): void {
    updateStyles()
    applyRootClass()
  }

  return { install, name, current, themes, themeClasses, styles, isDark, change, toggle }
}

export const makeThemeProps = propsFactory(
  {
    theme: String as PropType<string>,
  },
  'theme'
)

/** Components call this to participate in theming (and override the theme locally). */
export function provideTheme(props: { theme?: string } = {}) {
  const theme = inject(ThemeSymbol)
  if (!theme) throw new Error('[Vue DL] Could not find theme instance')

  const name = computed(() => props.theme ?? theme.name.value)
  const themeClasses = computed(() => `vd-theme--${name.value}`)

  provide(ThemeSymbol, theme)

  return { themeClasses, current: theme.current, name, isDark: theme.isDark }
}

export function useTheme(): ThemeInstance {
  const theme = inject(ThemeSymbol)
  if (!theme) throw new Error('[Vue DL] Could not find theme instance')
  return theme
}
