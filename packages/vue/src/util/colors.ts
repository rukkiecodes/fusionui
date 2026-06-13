// Color parsing/conversion utilities. Used by useColor (Batch 02) and the
// theme engine (Batch 03) for CSS-variable generation and contrast.

export interface RGB {
  r: number
  g: number
  b: number
}

export interface RGBA extends RGB {
  a: number
}

/** True when the string is a directly-usable CSS color (hex / rgb / hsl / var). */
export function isCssColor(color?: string | null | false): color is string {
  return !!color && /^(#|var\(--|(rgb|hsl)a?\()/.test(color)
}

export function isParsableColor(color: string): boolean {
  return isCssColor(color) || /^#[0-9a-f]{3,8}$/i.test(color)
}

function pad(n: string, length = 2): string {
  return n.length < length ? '0'.repeat(length - n.length) + n : n
}

export function parseHex(hex: string): RGBA {
  let h = hex.replace('#', '')
  if (h.length === 3 || h.length === 4) {
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  }
  if (h.length !== 6 && h.length !== 8) {
    throw new Error(`'${hex}' is not a valid hex color`)
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
    a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
  }
}

export function parseColor(color: string | number): RGBA {
  if (typeof color === 'number') {
    return {
      r: (color & 0xff0000) >> 16,
      g: (color & 0x00ff00) >> 8,
      b: color & 0x0000ff,
      a: 1,
    }
  }
  const trimmed = color.trim()
  if (trimmed.startsWith('#')) return parseHex(trimmed)
  const rgbMatch = trimmed.match(/rgba?\(([^)]+)\)/)
  if (rgbMatch) {
    const [r, g, b, a] = rgbMatch[1].split(',').map(v => parseFloat(v.trim()))
    return { r, g, b, a: a == null ? 1 : a }
  }
  throw new Error(`Unsupported color format: '${color}'`)
}

export function RGBToHex({ r, g, b, a }: RGBA): string {
  const parts = [r, g, b].map(c => pad(Math.round(c).toString(16)))
  if (a != null && a < 1) parts.push(pad(Math.round(a * 255).toString(16)))
  return `#${parts.join('')}`
}

/** Relative luminance (0 = black, 1 = white) used to pick contrasting text. */
export function getLuma(color: string | number): number {
  const { r, g, b } = parseColor(color)
  const srgb = [r, g, b].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

/** Returns true when text on this background should be dark. */
export function isLightColor(color: string | number): boolean {
  return getLuma(color) > 0.18
}
