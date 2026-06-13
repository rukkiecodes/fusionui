// The app-shell shape engine (native) — byte-for-byte the same math as
// packages/vue/src/engine/shell, emitting renderer-agnostic PathCommand[]. The
// only difference is the materialiser: web serialises with pathToSvg, native
// replays into an SkPath with buildSkiaPath. Keep the two in sync.

import type { PathCommand } from './path'

/** Polynomial smooth-min (Inigo Quilez) — the metaball merge operator. */
export function smin(a: number, b: number, k: number): number {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}

// 1 − 0.5523 (the quarter-circle Bézier constant).
const QUARTER = 0.4477

/**
 * The junction fillet, in a local box of `size`×`size` whose (0,0) is the corner
 * point and whose content fills the bottom-right. Fill it with the shell colour:
 * the content beneath reads with a convex rounded corner nestled into the shell.
 */
export function shellCornerCommands(size: number): PathCommand[] {
  const s = Math.max(size, 0)
  const c = s * QUARTER
  return [
    { type: 'M', x: 0, y: 0 },
    { type: 'L', x: s, y: 0 },
    { type: 'C', x1: c, y1: 0, x2: 0, y2: c, x: 0, y: s },
    { type: 'Z' },
  ]
}

export interface ShellContentGeometry {
  width: number
  height: number
  sidebarWidth: number
  navbarHeight: number
  radius: number
}

/**
 * The full content-panel outline: a rectangle from the navbar/sidebar junction to
 * the bottom-right, with the top-left corner rounded convex (nestled into the
 * shell). Fill an SkPath with this to draw the content surface on native.
 */
export function shellContentCommands(geom: ShellContentGeometry): PathCommand[] {
  const { width: w, height: h, sidebarWidth: x0, navbarHeight: y0 } = geom
  const r = Math.max(0, Math.min(geom.radius, (w - x0) / 2, (h - y0) / 2))
  const c = r * QUARTER
  return [
    { type: 'M', x: x0 + r, y: y0 },
    { type: 'L', x: w, y: y0 },
    { type: 'L', x: w, y: h },
    { type: 'L', x: x0, y: h },
    { type: 'L', x: x0, y: y0 + r },
    { type: 'C', x1: x0, y1: y0 + r - c, x2: x0 + r - c, y2: y0, x: x0 + r, y: y0 },
    { type: 'Z' },
  ]
}
