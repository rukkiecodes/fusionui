// Colour-space maths for FColorPicker / FColorInput.
//
// The primitives that already exist in `util/colors` (hex parsing, rgb parsing,
// rgb→hex, luma) are reused as-is; this module only adds what a picker needs on
// top of them — HSV/HSL, the CSS `hsl()` string forms, the per-mode input specs
// and the round-trip that hands the model back in whatever shape it came in.
//
// Pure functions only: no DOM, no Vue. Angles are degrees (0–360); saturation,
// value, lightness and alpha are 0–1 fractions.

import { RGBToHex, isCssColor, parseColor, parseHex } from '../../util/colors'
import type { RGB, RGBA } from '../../util/colors'

export interface HSVA {
  h: number
  s: number
  v: number
  a: number
}

export interface HSLA {
  h: number
  s: number
  l: number
  a: number
}

export type ColorPickerMode = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla'

/** What `modelValue` may be given as — and what it is handed back as. */
export type ColorValue = string | Partial<RGBA> | Partial<HSLA> | Partial<HSVA> | null | undefined

export const nullColor: HSVA = { h: 0, s: 0, v: 0, a: 1 }

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function has(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.every(key => key in obj)
}

// ---------------------------------------------------------------- conversions

export function RGBtoHSV(rgba: RGBA): HSVA {
  const r = clamp(rgba.r, 0, 255) / 255
  const g = clamp(rgba.g, 0, 255) / 255
  const b = clamp(rgba.b, 0, 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6)
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
  }
  if (h < 0) h += 360

  return { h, s: max === 0 ? 0 : delta / max, v: max, a: clamp(rgba.a ?? 1, 0, 1) }
}

export function HSVtoRGB(hsva: HSVA): RGBA {
  const h = ((hsva.h % 360) + 360) % 360
  const s = clamp(hsva.s, 0, 1)
  const v = clamp(hsva.v, 0, 1)

  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  const sextant = Math.floor(h / 60) % 6
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][sextant]

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: clamp(hsva.a ?? 1, 0, 1),
  }
}

export function HSVtoHSL(hsva: HSVA): HSLA {
  const { h, s, v, a } = hsva
  const l = v - (v * s) / 2
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)
  return { h, s: clamp(sl, 0, 1), l: clamp(l, 0, 1), a }
}

export function HSLtoHSV(hsla: HSLA): HSVA {
  const { h, s, l, a } = hsla
  const v = l + s * Math.min(l, 1 - l)
  const sv = v === 0 ? 0 : 2 * (1 - l / v)
  return { h, s: clamp(sv, 0, 1), v: clamp(v, 0, 1), a }
}

export function HSLtoRGB(hsla: HSLA): RGBA {
  return HSVtoRGB(HSLtoHSV(hsla))
}

/** `#rrggbb`, or `#rrggbbaa` when `alpha` is asked for. */
export function HSVtoHex(hsva: HSVA, alpha = false): string {
  const rgba = HSVtoRGB(hsva)
  const hex = RGBToHex({ ...rgba, a: 1 })
  if (!alpha) return hex
  const a = Math.round(clamp(rgba.a, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

export function HexToHSV(hex: string): HSVA {
  return RGBtoHSV(parseHex(hex))
}

/** A CSS colour for the previews/ramps — always fully opaque unless asked otherwise. */
export function HSVtoCSS(hsva: HSVA, alpha = true): string {
  const { r, g, b, a } = HSVtoRGB(hsva)
  return alpha && a < 1 ? `rgba(${r}, ${g}, ${b}, ${round(a, 2)})` : `rgb(${r}, ${g}, ${b})`
}

/** The `r, g, b` triplet FusionUI's `rgb(var(--x))` colour vars expect. */
export function HSVtoRGBTriplet(hsva: HSVA): string {
  const { r, g, b } = HSVtoRGB(hsva)
  return `${r}, ${g}, ${b}`
}

function round(value: number, digits = 0): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

// ---------------------------------------------------------------- parsing

const HEX_RE = /^#?(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim())
}

function parseChannel(part: string, scale: number): number {
  const value = parseFloat(part)
  return part.trim().endsWith('%') ? (value / 100) * scale : value
}

/**
 * Parses every CSS colour string a picker can be handed: hex (3/4/6/8),
 * `rgb()`/`rgba()` and `hsl()`/`hsla()`, in both the legacy comma syntax and the
 * modern space/slash syntax. Throws on anything else.
 */
export function parseCssColor(value: string): RGBA {
  const input = value.trim()

  if (input.startsWith('#')) return parseHex(input)

  const hsl = input.match(/^hsla?\(([^)]+)\)$/i)
  if (hsl) {
    const parts = hsl[1].split(/[\s,/]+/).filter(Boolean)
    return HSLtoRGB({
      h: parseFloat(parts[0]),
      s: clamp(parseChannel(parts[1], 1) / (parts[1].includes('%') ? 1 : 100), 0, 1),
      l: clamp(parseChannel(parts[2], 1) / (parts[2].includes('%') ? 1 : 100), 0, 1),
      a: parts[3] != null ? clamp(parseChannel(parts[3], 1), 0, 1) : 1,
    })
  }

  const rgb = input.match(/^rgba?\(([^)]+)\)$/i)
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean)
    return {
      r: clamp(parseChannel(parts[0], 255), 0, 255),
      g: clamp(parseChannel(parts[1], 255), 0, 255),
      b: clamp(parseChannel(parts[2], 255), 0, 255),
      a: parts[3] != null ? clamp(parseChannel(parts[3], 1), 0, 1) : 1,
    }
  }

  if (isValidHex(input)) return parseHex(input)

  // Everything else (named colours, `var(--x)`, …) is out of scope for the maths.
  return parseColor(input)
}

/** `modelValue` (string, `{r,g,b}`, `{h,s,l}`, `{h,s,v}`) → HSVA. `null` when unusable. */
export function toHSVA(value: ColorValue): HSVA | null {
  if (value == null || value === '') return null

  if (typeof value === 'string') {
    try {
      return RGBtoHSV(parseCssColor(value))
    } catch {
      return null
    }
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, number>
    if (has(obj, ['r', 'g', 'b'])) {
      return RGBtoHSV({ r: obj.r, g: obj.g, b: obj.b, a: obj.a ?? 1 })
    }
    if (has(obj, ['h', 's', 'l'])) {
      return HSLtoHSV({ h: obj.h, s: obj.s, l: obj.l, a: obj.a ?? 1 })
    }
    if (has(obj, ['h', 's', 'v'])) {
      return { h: obj.h, s: obj.s, v: obj.v, a: obj.a ?? 1 }
    }
  }

  return null
}

/** True for anything `toHSVA` can read — used to decide when typed text is committable. */
export function isValidColor(value: ColorValue): boolean {
  return toHSVA(value) != null
}

export function toRgbString(hsva: HSVA, alpha: boolean): string {
  const { r, g, b, a } = HSVtoRGB(hsva)
  return alpha ? `rgba(${r}, ${g}, ${b}, ${round(a, 2)})` : `rgb(${r}, ${g}, ${b})`
}

export function toHslString(hsva: HSVA, alpha: boolean): string {
  const { h, s, l, a } = HSVtoHSL(hsva)
  const head = `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
  return alpha ? `hsla(${head}, ${round(a, 2)})` : `hsl(${head})`
}

/**
 * Hands the colour back in the same shape it arrived in — a `{r,g,b}` model stays
 * an object, an `hsl()` string stays an `hsl()` string, and an unset model
 * becomes a hex string. Mirrors Vuetify's `extractColor`.
 */
export function fromHSVA(hsva: HSVA, template: ColorValue): string | Record<string, number> {
  const hasAlpha = hsva.a < 1

  if (template == null || typeof template === 'string') {
    const input = (template ?? '').trim().toLowerCase()
    if (input.startsWith('rgb')) return toRgbString(hsva, hasAlpha || input.startsWith('rgba'))
    if (input.startsWith('hsl')) return toHslString(hsva, hasAlpha || input.startsWith('hsla'))
    return HSVtoHex(hsva, hasAlpha || input.replace('#', '').length === 8)
  }

  const obj = template as Record<string, number>
  const keepAlpha = 'a' in obj || hasAlpha

  if (has(obj, ['r', 'g', 'b'])) {
    const { r, g, b, a } = HSVtoRGB(hsva)
    return keepAlpha ? { r, g, b, a: round(a, 2) } : { r, g, b }
  }
  if (has(obj, ['h', 's', 'l'])) {
    const { h, s, l, a } = HSVtoHSL(hsva)
    const base = { h: round(h, 1), s: round(s, 3), l: round(l, 3) }
    return keepAlpha ? { ...base, a: round(a, 2) } : base
  }

  const base = { h: round(hsva.h, 1), s: round(hsva.s, 3), v: round(hsva.v, 3) }
  return keepAlpha ? { ...base, a: round(hsva.a, 2) } : base
}

// ---------------------------------------------------------------- edit modes

export interface ColorInputSpec {
  key: string
  /** The short label printed under the field. */
  label: string
  /** The spoken label — inputs are never identified by a single letter alone. */
  name: string
  type: 'text' | 'number'
  min?: number
  max?: number
  step?: number
  getValue: (color: HSVA) => string | number
  /** Returns the unchanged colour when the text is not a usable value. */
  setValue: (color: HSVA, value: string) => HSVA
}

function rgbInput(key: 'r' | 'g' | 'b', label: string, name: string): ColorInputSpec {
  return {
    key,
    label,
    name,
    type: 'number',
    min: 0,
    max: 255,
    step: 1,
    getValue: color => Math.round(HSVtoRGB(color)[key as keyof RGB] as number),
    setValue: (color, value) => {
      const next = Number(value)
      if (!Number.isFinite(next)) return color
      const rgba = HSVtoRGB(color)
      return RGBtoHSV({ ...rgba, [key]: clamp(next, 0, 255) })
    },
  }
}

const alphaInput: ColorInputSpec = {
  key: 'a',
  label: 'A',
  // Alpha is edited as a whole-number percentage everywhere in the picker, so the
  // numeric fields, the slider and the announcements all agree.
  name: 'Alpha percent',
  type: 'number',
  min: 0,
  max: 100,
  step: 1,
  getValue: color => Math.round(color.a * 100),
  setValue: (color, value) => {
    const next = Number(value)
    if (!Number.isFinite(next)) return color
    return { ...color, a: clamp(next / 100, 0, 1) }
  },
}

const hexInput = (alpha: boolean): ColorInputSpec => ({
  key: 'hex',
  label: alpha ? 'HEXA' : 'HEX',
  name: alpha ? 'Hex color with alpha' : 'Hex color',
  type: 'text',
  getValue: color => HSVtoHex(color, alpha),
  setValue: (color, value) => (isValidHex(value) ? HexToHSV(value) : color),
})

const hueInput: ColorInputSpec = {
  key: 'h',
  label: 'H',
  name: 'Hue degrees',
  type: 'number',
  min: 0,
  max: 360,
  step: 1,
  getValue: color => Math.round(color.h),
  setValue: (color, value) => {
    const next = Number(value)
    if (!Number.isFinite(next)) return color
    return { ...color, h: clamp(next, 0, 360) }
  },
}

function hslInput(key: 's' | 'l', label: string, name: string): ColorInputSpec {
  return {
    key,
    label,
    name,
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    getValue: color => Math.round(HSVtoHSL(color)[key] * 100),
    setValue: (color, value) => {
      const next = Number(value)
      if (!Number.isFinite(next)) return color
      const hsl = HSVtoHSL(color)
      return HSLtoHSV({ ...hsl, [key]: clamp(next / 100, 0, 1) })
    },
  }
}

const rgbInputs = [
  rgbInput('r', 'R', 'Red'),
  rgbInput('g', 'G', 'Green'),
  rgbInput('b', 'B', 'Blue'),
]
const hslInputs = [
  hueInput,
  hslInput('s', 'S', 'Saturation percent'),
  hslInput('l', 'L', 'Lightness percent'),
]

export const colorModes: Record<ColorPickerMode, ColorInputSpec[]> = {
  hex: [hexInput(false)],
  hexa: [hexInput(true)],
  rgb: rgbInputs,
  rgba: [...rgbInputs, alphaInput],
  hsl: hslInputs,
  hsla: [...hslInputs, alphaInput],
}

export const colorModeNames = Object.keys(colorModes) as ColorPickerMode[]

/** Modes that carry an alpha channel — these are the ones that show the alpha slider. */
export function modeHasAlpha(mode: ColorPickerMode): boolean {
  return mode.endsWith('a') && mode !== 'hsl'
}

// ---------------------------------------------------------------- swatches

/**
 * The default swatch grid, generated from HSL rather than hard-coded hex: three
 * tints of eight hues plus a greyscale row.
 */
function createDefaultSwatches(): string[][] {
  const hues = [0, 30, 50, 120, 175, 210, 265, 320]
  const rows = [0.72, 0.55, 0.38].map(l =>
    hues.map(h => HSVtoHex(HSLtoHSV({ h, s: 0.72, l, a: 1 })))
  )
  const greys = [1, 0.86, 0.68, 0.5, 0.3, 0.12, 0.06, 0].map(l =>
    HSVtoHex(HSLtoHSV({ h: 0, s: 0, l, a: 1 }))
  )
  return [...rows, greys]
}

export const defaultSwatches: string[][] = createDefaultSwatches()

export { clamp, isCssColor }
export type { RGB, RGBA }
