/**
 * Variant resolver — the native sibling of the web `useVariant`.
 *
 * The web resolves variants to CSS classes + a `--fui-variant-color` custom
 * property; native has no class cascade, so this returns concrete RN style
 * values instead. The variant *names* and their meaning are identical across
 * platforms, so `<FButton variant="tonal" color="primary">` looks the same on
 * both.
 *
 * Pure (no React, no react-native) so it's unit-testable in plain Node.
 */

import type { FusionTheme } from '../theme/tokens'

export type Variant =
  | 'elevated'
  | 'flat'
  | 'floating'
  | 'relief'
  | 'shadow'
  | 'gradient'
  | 'tonal'
  | 'outlined'
  | 'line'
  | 'text'
  | 'plain'

/** Variants whose colour fills the background (vs. tinting the foreground). */
const BACKGROUND_VARIANTS: Variant[] = [
  'elevated',
  'flat',
  'floating',
  'relief',
  'shadow',
  'gradient',
]
/** Variants that carry the resting soft shadow. */
const SHADOW_VARIANTS: Variant[] = ['elevated', 'floating', 'relief', 'shadow']

const TONAL_ALPHA = 0.14
const OUTLINE_ALPHA = 0.42
const PLAIN_OPACITY = 0.82

export interface VariantStyle {
  /** Container fill. */
  backgroundColor: string
  /** Text / foreground colour. */
  color: string
  /** Border colour (only set for outlined/line). */
  borderColor?: string
  /** Border width (0 for none). */
  borderWidth: number
  /** Whether the container should carry the theme's resting shadow. */
  elevated: boolean
}

/** Convert a `#rrggbb` (or `#rgb`) hex to `rgba(...)`. Non-hex passes through. */
export function withAlpha(color: string, alpha: number): string {
  if (typeof color !== 'string' || color[0] !== '#') return color
  let hex = color.slice(1)
  if (hex.length === 3)
    hex = hex
      .split('')
      .map(c => c + c)
      .join('')
  const n = parseInt(hex, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Resolve `{ variant, color }` to concrete native styles against a theme.
 * `color` is a theme colour name (primary, success, …) or any raw colour string.
 */
export function resolveVariant(
  theme: FusionTheme,
  opts: { variant?: Variant; color?: string } = {}
): VariantStyle {
  const variant = opts.variant ?? 'elevated'
  const { color } = opts
  const elevated = SHADOW_VARIANTS.includes(variant)

  if (BACKGROUND_VARIANTS.includes(variant)) {
    const backgroundColor = color ? (theme.colors[color] ?? color) : theme.colors.surface
    const fg = color ? (theme.colors[`on-${color}`] ?? '#ffffff') : theme.colors['on-surface']
    return { backgroundColor, color: fg, borderWidth: 0, elevated }
  }

  // foreground variants — the colour tints the text/border, not the fill
  const fg = color ? (theme.colors[color] ?? color) : theme.colors['on-surface']
  switch (variant) {
    case 'tonal':
      return {
        backgroundColor: withAlpha(fg, TONAL_ALPHA),
        color: fg,
        borderWidth: 0,
        elevated: false,
      }
    case 'outlined':
    case 'line':
      return {
        backgroundColor: 'transparent',
        color: fg,
        borderColor: withAlpha(fg, OUTLINE_ALPHA),
        borderWidth: 1,
        elevated: false,
      }
    case 'plain':
      return {
        backgroundColor: 'transparent',
        color: withAlpha(fg, PLAIN_OPACITY),
        borderWidth: 0,
        elevated: false,
      }
    case 'text':
    default:
      return { backgroundColor: 'transparent', color: fg, borderWidth: 0, elevated: false }
  }
}
