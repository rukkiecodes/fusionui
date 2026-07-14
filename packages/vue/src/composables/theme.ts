import { computed, inject, provide, ref } from 'vue'
import type { App, ComputedRef, InjectionKey, PropType, Ref } from 'vue'
import { themes as tokenThemes } from '@rukkiecodes/tokens'
import { propsFactory } from '../util/propsFactory'
import { isLightColor, parseColor } from '../util/colors'
import { mergeDeep } from '../util/helpers'

// Theme engine: generates `--fui-theme-*` CSS variables (RGB triplets so
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

export const ThemeSymbol: InjectionKey<ThemeInstance> = Symbol.for('fusionui:theme')

const LAYER_ORDER = '@layer fui-tokens, fui-theme, fui-base, fui-components, fui-utilities;'
const STYLE_ID = 'fusionui-theme-stylesheet'

// The two default themes (palette + per-surface variables) come from
// @rukkiecodes/tokens — the single source of design truth. The runtime generation
// logic below (triplet conversion, on-color derivation, CSS-var injection) is
// unchanged; only the literal values moved out to the tokens package.
const vuesaxLight: ThemeDefinition = tokenThemes.light
const vuesaxDark: ThemeDefinition = tokenThemes.dark

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
    lines.push(`--fui-theme-${key}: ${colorToTriplet(value)};`)
    const onKey = `on-${key}`
    const onValue = theme.colors[onKey] ? colorToTriplet(theme.colors[onKey]) : onColor(value)
    lines.push(`--fui-theme-${onKey}: ${onValue};`)
  }
  for (const [key, value] of Object.entries(theme.variables ?? {})) {
    const cssValue =
      typeof value === 'string' && value.startsWith('#') ? colorToTriplet(value) : value
    lines.push(`--fui-${key}: ${cssValue};`)
  }
  return lines.join(' ')
}

function genColorUtilities(colorKeys: string[]): string {
  const out: string[] = []
  for (const key of colorKeys) {
    if (key.startsWith('on-')) continue
    out.push(
      `.bg-${key} { background-color: rgb(var(--fui-theme-${key})) !important; color: rgb(var(--fui-theme-on-${key})) !important; }`
    )
    out.push(`.text-${key} { color: rgb(var(--fui-theme-${key})) !important; }`)
    out.push(`.border-${key} { border-color: rgb(var(--fui-theme-${key})) !important; }`)
    out.push(`.text-on-${key} { color: rgb(var(--fui-theme-on-${key})) !important; }`)
  }
  return out.join('\n')
}

export function createTheme(options: ThemeOptions = {}): ThemeInstance {
  // Deep-merged OVER the built-in themes rather than replacing them. Overriding
  // one colour is the common case, and a wholesale replace made that quietly
  // destructive: `themes: { light: { colors: { primary } } }` used to delete the
  // dark theme entirely and leave `light` with a single colour, with no warning.
  // Anything you do declare still wins, so a fully custom theme is unaffected.
  const themes = ref<Record<string, ThemeDefinition>>(
    mergeDeep(
      { light: vuesaxLight, dark: vuesaxDark } as unknown as Record<string, unknown>,
      (options.themes ?? {}) as Record<string, unknown>
    ) as Record<string, ThemeDefinition>
  )
  const name = ref(options.defaultTheme ?? 'light')

  const current = computed<ThemeDefinition>(() => themes.value[name.value] ?? vuesaxLight)
  const isDark = computed(() => current.value.dark)
  const themeClasses = computed(() => `fui-theme--${name.value}`)

  const styles = computed(() => {
    const blocks: string[] = [LAYER_ORDER]
    const themeBlocks: string[] = []
    for (const [themeName, def] of Object.entries(themes.value)) {
      const selector =
        themeName === name.value ? `:root, .fui-theme--${themeName}` : `.fui-theme--${themeName}`
      themeBlocks.push(`${selector} { ${genThemeVariables(def)} }`)
    }
    blocks.push(`@layer fui-theme {\n${themeBlocks.join('\n')}\n}`)

    const colorKeys = Object.keys(current.value.colors)
    blocks.push(`@layer fui-utilities {\n${genColorUtilities(colorKeys)}\n}`)
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
      root.classList.toggle(`fui-theme--${themeName}`, themeName === name.value)
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
  if (!theme) throw new Error('[FusionUI] Could not find theme instance')

  const name = computed(() => props.theme ?? theme.name.value)
  const themeClasses = computed(() => `fui-theme--${name.value}`)

  provide(ThemeSymbol, theme)

  return { themeClasses, current: theme.current, name, isDark: theme.isDark }
}

export function useTheme(): ThemeInstance {
  const theme = inject(ThemeSymbol)
  if (!theme) throw new Error('[FusionUI] Could not find theme instance')
  return theme
}
