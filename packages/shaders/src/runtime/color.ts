// Normalise any CSS color the browser understands (hex, rgb(), hsl(), named)
// into rgb 0..1 for shader uniforms. var() is not resolved here — pass concrete
// colors (the defaults are brand hexes); the CSS fallback path takes the string
// verbatim so it always renders.

let probe: CanvasRenderingContext2D | null | undefined

function ctx(): CanvasRenderingContext2D | null {
  if (probe !== undefined) return probe
  if (typeof document === 'undefined') return (probe = null)
  const c = document.createElement('canvas')
  c.width = c.height = 1
  probe = c.getContext('2d')
  return probe
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

/** CSS color string → [r,g,b] in 0..1. Falls back to mid-gray if unresolvable. */
export function toRgb01(color: string): [number, number, number] {
  const hex = color.trim()
  if (HEX.test(hex)) {
    let h = hex.slice(1)
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
    ]
  }
  const c = ctx()
  if (!c) return [0.5, 0.5, 0.5]
  c.clearRect(0, 0, 1, 1)
  c.fillStyle = '#000'
  c.fillStyle = color // browser parses/normalises
  c.fillRect(0, 0, 1, 1)
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}
