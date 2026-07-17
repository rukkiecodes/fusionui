import type { InputState } from './types'

// Light-theme palette mirroring the FusionUI tokens the web field uses.
export const PALETTE = {
  fill: '#e8ebf0', // surface-2 — default variant fill at rest
  fillFocus: '#eef1f6', // surface-3 — lightens slightly on focus
  surface: '#ffffff', // shadow variant background
  text: '#2b3440', // on-surface, ~0.9
  placeholder: '#9099a6', // on-surface, ~0.5
  labelActive: '#2b3440', // floated / pinned label (neutral unless coloured)
  line: 'rgba(43,52,64,0.18)', // underlined base line
  hint: 'rgba(43,52,64,0.55)',
  primary: '#195bff',
}

export const STATE_COLORS: Record<InputState, string> = {
  success: '#16a34a',
  danger: '#ef4444',
  warning: '#f59e0b',
  primary: '#195bff',
  dark: '#1e2530',
}

// hex → "r,g,b" for building rgba() strings.
export function rgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return hex
  let h = m[1]
  if (h.length === 3)
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}
