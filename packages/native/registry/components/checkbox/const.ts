import type { CheckboxSize } from './types'

// Light-theme palette mirroring the FusionUI tokens the web selection control uses.
export const PALETTE = {
  border: 'rgba(43,52,64,0.4)', // on-surface @ 0.4 — the idle box outline
  label: '#2b3440', // on-surface, ~0.9
  onAccent: '#ffffff', // on-primary — the mark drawn inside a filled box
  primary: '#195bff',
}

// The web box is a fixed 20px; mobile needs a little more, so `md` sits at 22
// and the row keeps a 44pt tap target via hitSlop (see index.tsx).
export const SIZES: Record<CheckboxSize, { box: number; border: number; font: number }> = {
  sm: { box: 18, border: 2, font: 13 },
  md: { box: 22, border: 2, font: 15 },
  lg: { box: 26, border: 2.5, font: 16 },
}

// Both marks are drawn in a 24×24 viewBox, identical to the web component's SVG.
// The dash length is the path's own length rounded up, so `strokeDashoffset` can
// sweep it from fully hidden to fully drawn without measuring at runtime.
export const TICK = { d: 'M5 12l5 5L20 7', length: 22 }
export const DASH = { d: 'M6 12h12', length: 12 }

// Web: `transition: 0.25s` on the box, `0.2s` on the mark's dashoffset.
export const DURATION = { box: 250, mark: 200, icon: 200 }

export const RADIUS = 6 // --fui-radius-sm
