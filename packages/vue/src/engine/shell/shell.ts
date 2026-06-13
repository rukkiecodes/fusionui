// The app-shell shape engine.
//
// The navbar + sidebar form a "shell" around the content. Where they meet, the
// junction is a fluid corner (the content nestles in with a convex round; the
// shell's inside corner carries the negative radius). This module computes those
// shapes with the fusion-goo smooth-minimum and emits **renderer-agnostic path
// commands** — the same `PathCommand[]` the chart engine uses — so one geometry
// drives every backend:
//
//   web:    pathToSvg(cmds)            → <path d> / clip-path: path()
//   native: buildSkiaPath(Skia, cmds)  → SkPath  (@fusionui/native)
//
// Keep the shape math here; only the final serialise step is platform-specific.
import { pathToSvg } from '../chart'
import type { PathCommand } from '../chart'

export { pathToSvg }
export type { PathCommand }

/** Polynomial smooth-min (Inigo Quilez) — the metaball merge operator. */
export function smin(a: number, b: number, k: number): number {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}

// 1 − 0.5523 (the quarter-circle Bézier constant): control offset one blend in
// from each axis, so the corner is a crisp quarter round.
const QUARTER = 0.4477

/**
 * The junction fillet, in a local box of `size`×`size` whose (0,0) is the corner
 * point and whose content fills the bottom-right. Filled with the shell colour it
 * occupies only the small wedge between the corner and a quarter round, so the
 * content beneath reads with a convex rounded corner nestled into the shell.
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

/** Convenience: the junction fillet as an SVG path string (web clip-path / d). */
export function shellCornerSvg(size: number): string {
  return pathToSvg(shellCornerCommands(size))
}

export interface ShellContentGeometry {
  /** Total shell width (e.g. viewport width). */
  width: number
  /** Total shell height. */
  height: number
  /** Width of the docked sidebar (the content starts at this x). */
  sidebarWidth: number
  /** Height of the navbar (the content starts at this y). */
  navbarHeight: number
  /** Radius of the nestled top-left corner. */
  radius: number
}

/**
 * The full content-panel outline as path commands: a rectangle from the
 * navbar/sidebar junction to the bottom-right, with the top-left corner rounded
 * convex (nestled into the shell). The web can clip the content surface to this;
 * native can fill an SkPath with it. This is the extension point for richer goo
 * shells (more junctions, animated blends) — they all stay path commands.
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
    // convex quarter round back up to the top edge
    { type: 'C', x1: x0, y1: y0 + r - c, x2: x0 + r - c, y2: y0, x: x0 + r, y: y0 },
    { type: 'Z' },
  ]
}
