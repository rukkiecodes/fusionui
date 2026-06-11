import { computed, inject, provide, ref } from 'vue'
import type { App, ComputedRef, InjectionKey, PropType, Ref } from 'vue'
import { propsFactory } from '../util/propsFactory'
import { parseColor } from '../util/colors'

// NOTE: This is the minimal theme runtime that makes the framework installable.
// Batch 03 replaces genCssVariables/install with the full engine (CSS @layers,
// auto `on-*` contrast colors, generated utility classes, runtime transitions).

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
  change: (name: string) => void
  toggle: (themes?: [string, string]) => void
}

export const ThemeSymbol: InjectionKey<ThemeInstance> = Symbol.for('vuedl:theme')

// Vuesax palette (see plans/03-theme-design-tokens.md).
const vuesaxLight: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#1f74ff',
    secondary: '#7931b1',
    success: '#46c93a',
    danger: '#ff4757',
    warning: '#ffba00',
    dark: '#1e1e1e',
    light: '#f5f5f5',
  },
}

const vuesaxDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#1f74ff',
    secondary: '#9b59d0',
    success: '#46c93a',
    danger: '#ff4757',
    warning: '#ffba00',
    dark: '#f5f5f5',
    light: '#2a2a2a',
  },
}

const STYLE_ID = 'vue-dl-theme-stylesheet'

function genCssVariables(theme: ThemeDefinition): string {
  const lines: string[] = []
  for (const [key, value] of Object.entries(theme.colors)) {
    const { r, g, b } = parseColor(value)
    lines.push(`--vd-theme-${key}: ${r},${g},${b};`)
  }
  return lines.join(' ')
}

export function createTheme(options: ThemeOptions = {}): ThemeInstance {
  const themes = ref<Record<string, ThemeDefinition>>(
    options.themes ?? { light: vuesaxLight, dark: vuesaxDark }
  )
  const name = ref(options.defaultTheme ?? 'light')

  const current = computed<ThemeDefinition>(() => themes.value[name.value] ?? vuesaxLight)
  const themeClasses = computed(() => `vd-theme--${name.value}`)

  const styles = computed(() => {
    const out: string[] = []
    for (const [themeName, def] of Object.entries(themes.value)) {
      const selector = themeName === name.value ? ':root' : `.vd-theme--${themeName}`
      out.push(`${selector} { ${genCssVariables(def)} }`)
    }
    return out.join('\n')
  })

  function updateStyles(): void {
    if (typeof document === 'undefined') return
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }
    el.textContent = styles.value
  }

  function change(newName: string): void {
    if (!themes.value[newName]) return
    name.value = newName
    updateStyles()
  }

  function toggle(pair: [string, string] = ['light', 'dark']): void {
    change(name.value === pair[0] ? pair[1] : pair[0])
  }

  function install(_app: App): void {
    updateStyles()
  }

  return { install, name, current, themes, themeClasses, change, toggle }
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

  return { themeClasses, current: theme.current, name }
}

export function useTheme(): ThemeInstance {
  const theme = inject(ThemeSymbol)
  if (!theme) throw new Error('[Vue DL] Could not find theme instance')
  return theme
}
