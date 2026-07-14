// FusionUI token generator.
//
// Single source of truth: src/tokens/base.json (theme-independent design tokens)
// + src/themes/{light,dark}.json (the two default theme color sets, authored in
// the runtime ThemeDefinition shape).
//
// Generates four platform outputs from that one source:
//   dist/css/tokens.css     — `--fui-*` custom properties (static + light/dark scopes)
//   dist/scss/_tokens.scss   — SASS `$fui-*` vars/maps consumed at build time by @rukkiecodes/vue
//   dist/ts/index.js + .d.ts — typed object for web logic (incl. the theme defs)
//   dist/native/index.js + .d.ts — RN-friendly object (numbers/ms, no CSS units or strings)
//
// Why a hand-rolled generator instead of Style Dictionary (the plan's default):
// the established `--fui-*` variable names — notably the composite `--fui-transition`
// and `--fui-transition-duration` — do not map cleanly onto Style Dictionary's
// systematic path-based naming, so adopting it would force a rename sweep across
// every component stylesheet and risk the pixel-identical guarantee. FusionUI.txt
// §12 sanctions changing a recommended default "with reason"; this is the reason.
// The rgb-triplet (web) and ms (native) transforms the plan called out live here.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const read = p => JSON.parse(readFileSync(join(ROOT, p), 'utf8'))

const base = read('src/tokens/base.json')
const light = read('src/themes/light.json')
const dark = read('src/themes/dark.json')
const themes = { light, dark }

// ---------------------------------------------------------------------------
// Color helpers — mirror packages/vue/src/util/colors.ts so emitted triplets and
// derived on-colors are byte-identical to the runtime theme engine.
// ---------------------------------------------------------------------------
function parseHex(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3 || h.length === 4)
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}
function triplet(hex) {
  const { r, g, b } = parseHex(hex)
  return `${r},${g},${b}`
}
function luma(hex) {
  const { r, g, b } = parseHex(hex)
  const s = [r, g, b].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2]
}
const onColor = hex => (luma(hex) > 0.18 ? '0,0,0' : '255,255,255')

// ---------------------------------------------------------------------------
// Shade scale
// ---------------------------------------------------------------------------
// Each theme colour is one hue, but real interfaces need a ramp of it: a tint for
// a hover wash, a deep shade for text on a pale fill. Rather than have every app
// invent its own (and drift), the scale is DERIVED from the palette so it can
// never disagree with the theme colour it belongs to — step 500 IS the base.
//
// Mixing straight towards white/black in sRGB, which is predictable and is what
// most systems do. The stops are the familiar 50…900.
const SHADE_STOPS = {
  50: ['white', 0.95],
  100: ['white', 0.88],
  200: ['white', 0.75],
  300: ['white', 0.58],
  400: ['white', 0.3],
  500: ['base', 0],
  600: ['black', 0.12],
  700: ['black', 0.28],
  800: ['black', 0.44],
  900: ['black', 0.6],
}

const clamp255 = n => Math.max(0, Math.min(255, Math.round(n)))
const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map(v => clamp255(v).toString(16).padStart(2, '0')).join('')

/** Mixes `hex` towards white or black by `amount` (0–1). */
function mix(hex, towards, amount) {
  const { r, g, b } = parseHex(hex)
  const t = towards === 'white' ? 255 : 0
  return toHex({
    r: r + (t - r) * amount,
    g: g + (t - g) * amount,
    b: b + (t - b) * amount,
  })
}

/** `{ 50: '#e8effe', …, 500: <base>, …, 900: '#0a244d' }` */
function shadesOf(hex) {
  return Object.fromEntries(
    Object.entries(SHADE_STOPS).map(([stop, [towards, amount]]) => [
      stop,
      towards === 'base' ? hex.toLowerCase() : mix(hex, towards, amount),
    ])
  )
}

// ---------------------------------------------------------------------------
// Shadow helpers
// ---------------------------------------------------------------------------
const shadowCss = s =>
  s.alpha === 0 && s.blur === 0 ? 'none' : `0 ${s.y}px ${s.blur}px 0 rgba(0, 0, 0, ${s.alpha})`
const shadowKeys = Object.keys(base.shadow)

// ---------------------------------------------------------------------------
// Derived flat value maps (shared by every output)
// ---------------------------------------------------------------------------
const radius = Object.fromEntries(Object.entries(base.radius).map(([k, v]) => [k, v.$value]))
const space = Object.fromEntries(Object.entries(base.space).map(([k, v]) => [k, v.$value]))
const opacity = Object.fromEntries(Object.entries(base.opacity).map(([k, v]) => [k, v.$value]))
const zIndex = Object.fromEntries(Object.entries(base['z-index']).map(([k, v]) => [k, v.$value]))
const breakpoint = Object.fromEntries(
  Object.entries(base.breakpoint).map(([k, v]) => [k, v.$value])
)
const shadows = Object.fromEntries(shadowKeys.map(k => [k, shadowCss(base.shadow[k].$value)]))

const fontFamily = base.font.family.base.$value
const fontFamilyMono = base.font.family.mono.$value
const fontSizeRoot = base.font.size.root.$value
const fontWeight = {
  regular: base.font.weight.regular.$value,
  medium: base.font.weight.medium.$value,
  bold: base.font.weight.bold.$value,
}
const letterSpacing = base.font['letter-spacing'].$value
const durationBase = base.motion.duration.base.$value
const durationFast = base.motion.duration.fast.$value
const easingBase = base.motion.easing.base.$value
const lift = base.motion.lift.$value
const sink = base.motion.sink.$value

// ---------------------------------------------------------------------------
// Theme variable emission — mirrors genThemeVariables() in theme.ts exactly.
// ---------------------------------------------------------------------------
function themeVarLines(def) {
  const lines = []
  for (const [key, value] of Object.entries(def.colors)) {
    if (key.startsWith('on-')) continue
    lines.push(`--fui-theme-${key}: ${triplet(value)};`)
    const onKey = `on-${key}`
    const onValue = def.colors[onKey] ? triplet(def.colors[onKey]) : onColor(value)
    lines.push(`--fui-theme-${onKey}: ${onValue};`)
  }
  for (const [key, value] of Object.entries(def.variables ?? {})) {
    const css = typeof value === 'string' && value.startsWith('#') ? triplet(value) : value
    lines.push(`--fui-${key}: ${css};`)
  }
  return lines
}

// The palette, and the shade ramp derived from it. Shared by every output so the
// CSS, SCSS and TS can never disagree about what `primary-300` is.
const PALETTE_KEYS = ['primary', 'secondary', 'success', 'danger', 'warning', 'dark', 'light']
const palette = Object.fromEntries(PALETTE_KEYS.map(k => [k, light.colors[k]]))
const shades = Object.fromEntries(Object.entries(palette).map(([k, hex]) => [k, shadesOf(hex)]))

// ===========================================================================
// 1. CSS — dist/css/tokens.css
// ===========================================================================
function buildCss() {
  const staticVars = [
    ...Object.entries(radius).map(([k, v]) => `--fui-radius-${k}: ${v};`),
    `--fui-transition-duration: ${durationBase};`,
    `--fui-transition-timing: ${easingBase};`,
    `--fui-transition: all ${durationBase} ${easingBase};`,
    `--fui-transition-fast: all ${durationFast} ${easingBase};`,
    `--fui-font-family: ${fontFamily};`,
    `--fui-font-family-mono: ${fontFamilyMono};`,
    `--fui-font-size-root: ${fontSizeRoot};`,
    `--fui-font-weight-regular: ${fontWeight.regular};`,
    `--fui-font-weight-medium: ${fontWeight.medium};`,
    `--fui-font-weight-bold: ${fontWeight.bold};`,
    `--fui-letter-spacing: ${letterSpacing};`,
    `--fui-spacer: ${space.spacer};`,
    ...Object.entries(space)
      .filter(([k]) => k !== 'spacer')
      .map(([k, v]) => `--fui-space-${k}: ${v};`),
    ...Object.entries(opacity).map(([k, v]) => `--fui-${k}-opacity: ${v};`),
    `--fui-motion-lift: ${lift};`,
    `--fui-motion-sink: ${sink};`,
    ...Object.entries(zIndex).map(([k, v]) => `--fui-z-${k}: ${v};`),
    ...Object.entries(breakpoint).map(([k, v]) => `--fui-breakpoint-${k}: ${v};`),
    ...shadowKeys.map(k => `--fui-elevation-${k}: ${shadows[k]};`),
    // RGB triplets, like every other colour token, so alpha works:
    //   background: rgba(var(--fui-primary-100), 0.5)
    ...Object.entries(shades).flatMap(([name, ramp]) =>
      Object.entries(ramp).map(([stop, hex]) => `--fui-${name}-${stop}: ${triplet(hex)};`)
    ),
  ]
  const indent = (arr, pad) => arr.map(l => pad + l).join('\n')
  const themeBlocks = [
    `  :root,\n  .fui-theme--light {\n${indent(themeVarLines(light), '    ')}\n  }`,
    `  .fui-theme--dark {\n${indent(themeVarLines(dark), '    ')}\n  }`,
  ]
  return `/* Generated by @rukkiecodes/tokens — do not edit. Source: src/tokens, src/themes. */
@layer fui-tokens, fui-theme, fui-base, fui-components, fui-utilities;

@layer fui-tokens {
  :root {
${indent(staticVars, '    ')}
  }
}

@layer fui-theme {
${themeBlocks.join('\n\n')}
}
`
}

// ===========================================================================
// 2. SCSS — dist/scss/_tokens.scss (build-time API for @rukkiecodes/vue)
// ===========================================================================
function buildScss() {
  const shadowMap = shadowKeys.map(k => `  ${k}: ${shadows[k]}`).join(',\n')
  // Built here rather than inline in the SCSS template, to keep that readable.
  const NL = '\n'
  const shadesMap = Object.entries(shades)
    .map(([name, ramp]) => {
      const stops = Object.entries(ramp)
        .map(([stop, hex]) => `    '${stop}': ${hex},`)
        .join(NL)
      return `  '${name}': (${NL}${stops}${NL}  ),`
    })
    .join(NL)

  const paletteMap = ['primary', 'secondary', 'success', 'danger', 'warning', 'dark', 'light']
    .map(k => `  '${k}': ${light.colors[k]}`)
    .join(',\n')
  return `// Generated by @rukkiecodes/tokens — do not edit. Source: src/tokens, src/themes.
// Re-exported by @rukkiecodes/vue settings so component SCSS reads tokens, not literals.

// Radii
$fui-radius-sm: ${radius.sm} !default;
$fui-radius-md: ${radius.md} !default;
$fui-radius-lg: ${radius.lg} !default;
$fui-radius-xl: ${radius.xl} !default;
$fui-radius-pill: ${radius.pill} !default;
$fui-radius-circle: ${radius.circle} !default;

// Motion
$fui-transition-duration: ${durationBase} !default;
$fui-transition-timing: ${easingBase} !default;
$fui-transition: all ${durationBase} ${easingBase} !default;
$fui-transition-fast: all ${durationFast} ${easingBase} !default;

// Typography
$fui-font-family: ${fontFamily} !default;
$fui-font-family-mono: ${fontFamilyMono} !default;
$fui-font-size-root: ${fontSizeRoot} !default;
$fui-font-weight-regular: ${fontWeight.regular} !default;
$fui-font-weight-medium: ${fontWeight.medium} !default;
$fui-font-weight-bold: ${fontWeight.bold} !default;
$fui-letter-spacing: ${letterSpacing} !default;

// Spacing (4px base)
$fui-spacer: ${space.spacer} !default;
$fui-space-1: ${space['1']} !default;
$fui-space-2: ${space['2']} !default;
$fui-space-3: ${space['3']} !default;
$fui-space-4: ${space['4']} !default;
$fui-space-5: ${space['5']} !default;
$fui-space-6: ${space['6']} !default;
$fui-space-7: ${space['7']} !default;

// Opacity
$fui-hover-opacity: ${opacity.hover} !default;
$fui-focus-opacity: ${opacity.focus} !default;
$fui-pressed-opacity: ${opacity.pressed} !default;

// Stacking order. Exposed to SASS as well as CSS so the stylesheet can emit the
// custom properties itself — a component reading var(--fui-z-menu) needs it to
// exist even when the consumer only imports the vue package's stylesheet.
$fui-z-index: (
${Object.entries(zIndex)
  .map(([k, v]) => `  ${k}: ${v},`)
  .join('\n')}
) !default;

// Elevation
$fui-shadows: (
${shadowMap}
) !default;
$fui-shadow-hover-spread: 0 10px 20px -10px !default;
$fui-shadow-floating: 0 8px 20px -6px !default;
$fui-shadow-rest: ${light.variables['shadow-rest']} !default;

// Palette (reference; runtime colors live in theme.ts via the TS output)
$fui-palette: (
${paletteMap}
) !default;

// The shade ramp derived from the palette. Step 500 is the base colour itself.
$fui-shades: (
${shadesMap}
) !default;
$fui-background: ${light.colors.background} !default;
$fui-surface: ${light.colors.surface} !default;
`
}

// ===========================================================================
// 3. TS — dist/ts/index.js + index.d.ts (web logic)
// ===========================================================================
function buildTs() {
  const obj = {
    radius,
    space,
    font: {
      family: { base: fontFamily, mono: fontFamilyMono },
      size: { root: fontSizeRoot },
      weight: fontWeight,
      letterSpacing,
    },
    motion: {
      duration: { base: durationBase, fast: durationFast },
      easing: { base: easingBase },
      lift,
      sink,
    },
    opacity,
    zIndex,
    breakpoint,
    shadows,
    themes,
  }
  const js = `// Generated by @rukkiecodes/tokens — do not edit.
export const radius = ${JSON.stringify(obj.radius, null, 2)}
export const space = ${JSON.stringify(obj.space, null, 2)}
export const font = ${JSON.stringify(obj.font, null, 2)}
export const motion = ${JSON.stringify(obj.motion, null, 2)}
export const opacity = ${JSON.stringify(obj.opacity, null, 2)}
export const zIndex = ${JSON.stringify(obj.zIndex, null, 2)}
export const breakpoint = ${JSON.stringify(obj.breakpoint, null, 2)}
export const shadows = ${JSON.stringify(obj.shadows, null, 2)}
export const themes = ${JSON.stringify(obj.themes, null, 2)}
export const shades = ${JSON.stringify(shades, null, 2)}
export const palette = ${JSON.stringify(palette, null, 2)}
export const tokens = { radius, space, font, motion, opacity, zIndex, breakpoint, shadows, themes, palette, shades }
export default tokens
`
  const dts = `// Generated by @rukkiecodes/tokens — do not edit.
export interface ThemeDefinition {
  dark: boolean
  colors: Record<string, string>
  variables: Record<string, string | number>
}
export declare const radius: Record<${Object.keys(radius)
    .map(k => `'${k}'`)
    .join(' | ')}, string>
export declare const space: Record<string, string>
export declare const font: {
  family: { base: string; mono: string }
  size: { root: string }
  weight: { regular: number; medium: number; bold: number }
  letterSpacing: string
}
export declare const motion: {
  duration: { base: string; fast: string }
  easing: { base: string }
  lift: string
  sink: string
}
export declare const opacity: Record<'hover' | 'focus' | 'pressed', number>
export declare const zIndex: Record<string, number>
export declare const breakpoint: Record<string, string>
export declare const shadows: Record<string, string>
export declare const themes: { light: ThemeDefinition; dark: ThemeDefinition }
export declare const tokens: {
  radius: typeof radius
  space: typeof space
  font: typeof font
  motion: typeof motion
  opacity: typeof opacity
  zIndex: typeof zIndex
  breakpoint: typeof breakpoint
  shadows: typeof shadows
  themes: typeof themes
}
export default tokens
`
  return { js, dts }
}

// ===========================================================================
// 4. Native — dist/native/index.js + index.d.ts (RN: numbers/ms, no CSS units)
// ===========================================================================
const px = v =>
  typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : v === '50%' ? 9999 : parseFloat(v)
const ms = v => Math.round(parseFloat(v) * 1000)

function nativeShadow(s) {
  return { color: '#000000', offsetX: 0, offsetY: s.y, blur: s.blur, opacity: s.alpha }
}
function nativeTheme(def) {
  const colors = {}
  for (const [k, v] of Object.entries(def.colors)) colors[k] = v // hex strings are RN-native
  const rest = def.variables['shadow-rest']
  // shadow-rest geometry equals elevation level 3; carry the per-theme alpha.
  const restAlpha = parseFloat(rest.match(/rgba\([^)]*?,\s*([\d.]+)\)/)[1])
  const variables = {}
  for (const [k, v] of Object.entries(def.variables)) {
    if (k === 'shadow-rest') continue
    variables[k] = v // opacities (numbers) and color hexes both pass through cleanly
  }
  return {
    dark: def.dark,
    colors,
    variables,
    shadowRest: { color: '#000000', offsetX: 0, offsetY: 5, blur: 20, opacity: restAlpha },
  }
}

function buildNative() {
  const obj = {
    radius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, px(v)])),
    space: Object.fromEntries(Object.entries(space).map(([k, v]) => [k, px(v)])),
    font: {
      family: { base: 'System', mono: 'Courier' },
      size: { root: px(fontSizeRoot) },
      weight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        bold: String(fontWeight.bold),
      },
    },
    motion: {
      duration: { base: ms(durationBase), fast: ms(durationFast) },
      lift: px(lift),
      sink: px(sink),
    },
    opacity,
    zIndex,
    breakpoint: Object.fromEntries(Object.entries(breakpoint).map(([k, v]) => [k, px(v)])),
    shadows: Object.fromEntries(shadowKeys.map(k => [k, nativeShadow(base.shadow[k].$value)])),
    themes: { light: nativeTheme(light), dark: nativeTheme(dark) },
  }
  const js = `// Generated by @rukkiecodes/tokens — do not edit. React Native target: durations in ms,
// dimensions as numbers, shadows as structured objects (no CSS units or strings).
export const radius = ${JSON.stringify(obj.radius, null, 2)}
export const space = ${JSON.stringify(obj.space, null, 2)}
export const font = ${JSON.stringify(obj.font, null, 2)}
export const motion = ${JSON.stringify(obj.motion, null, 2)}
export const opacity = ${JSON.stringify(obj.opacity, null, 2)}
export const zIndex = ${JSON.stringify(obj.zIndex, null, 2)}
export const breakpoint = ${JSON.stringify(obj.breakpoint, null, 2)}
export const shadows = ${JSON.stringify(obj.shadows, null, 2)}
export const themes = ${JSON.stringify(obj.themes, null, 2)}
export const tokens = { radius, space, font, motion, opacity, zIndex, breakpoint, shadows, themes }
export default tokens
`
  const dts = `// Generated by @rukkiecodes/tokens — do not edit.
export interface NativeShadow { color: string; offsetX: number; offsetY: number; blur: number; opacity: number }
export interface NativeThemeDefinition {
  dark: boolean
  colors: Record<string, string>
  variables: Record<string, string | number>
  shadowRest: NativeShadow
}
export declare const radius: Record<string, number>
export declare const space: Record<string, number>
export declare const font: {
  family: { base: string; mono: string }
  size: { root: number }
  weight: { regular: string; medium: string; bold: string }
}
export declare const motion: { duration: { base: number; fast: number }; lift: number; sink: number }
export declare const opacity: Record<'hover' | 'focus' | 'pressed', number>
export declare const zIndex: Record<string, number>
export declare const breakpoint: Record<string, number>
export declare const shadows: Record<string, NativeShadow>
export declare const themes: { light: NativeThemeDefinition; dark: NativeThemeDefinition }
export declare const tokens: {
  radius: typeof radius
  space: typeof space
  font: typeof font
  motion: typeof motion
  opacity: typeof opacity
  zIndex: typeof zIndex
  breakpoint: typeof breakpoint
  shadows: typeof shadows
  themes: typeof themes
}
export default tokens
`
  return { js, dts }
}

// ===========================================================================
// Emit
// ===========================================================================
function write(rel, content) {
  const out = join(ROOT, 'dist', rel)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, content)
  console.log(`  ${rel}`)
}

console.log('@rukkiecodes/tokens → generating dist/')
write('css/tokens.css', buildCss())
write('scss/_tokens.scss', buildScss())
const ts = buildTs()
write('ts/index.js', ts.js)
write('ts/index.d.ts', ts.dts)
const nat = buildNative()
write('native/index.js', nat.js)
write('native/index.d.ts', nat.dts)
console.log('done')
