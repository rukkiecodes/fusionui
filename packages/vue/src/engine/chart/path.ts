/**
 * FusionUI chart engine — the renderer-agnostic path layer.
 *
 * Every shape the engine produces (lines, areas, bars, arcs) is a list of
 * abstract PathCommands. That list is then materialised by whichever backend
 * you're drawing with:
 *
 *   • web    → `pathToSvg()` gives a `d` string for an <svg><path>
 *   • web    → `pathToCanvas()` replays onto a CanvasRenderingContext2D
 *   • native → `buildSkiaPath()` (native adapter) replays into an SkPath
 *   • GL     → tessellate the same commands, or feed the shader fills
 *
 * This is what lets one engine drive "Skia or GLSL" without forking the math:
 * the geometry is computed once, in data→pixel space, and only the final
 * emit step is backend-specific.
 *
 * Arcs are kept as explicit centre-arc commands (cx,cy,r,a0,a1) rather than
 * baked into béziers, so each backend can emit its own exact primitive
 * (SVG 'A', Skia addArc, GL triangle fan).
 */

export type PathCommand =
  | { type: 'M'; x: number; y: number }
  | { type: 'L'; x: number; y: number }
  | { type: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { type: 'Q'; x1: number; y1: number; x: number; y: number }
  | { type: 'ARC'; cx: number; cy: number; r: number; a0: number; a1: number }
  | { type: 'Z' }

const f = (n: number) => (Number.isFinite(n) ? +n.toFixed(3) : 0)

/** Endpoint params for one circular arc segment (≤ 2π). */
function arcSvg(c: Extract<PathCommand, { type: 'ARC' }>): string {
  const { cx, cy, r, a0, a1 } = c
  const delta = a1 - a0
  // split a near/over-full circle into two halves (SVG can't do ≥2π in one A)
  if (Math.abs(delta) >= Math.PI * 2) {
    const mid = a0 + Math.sign(delta) * Math.PI
    return (
      arcSvg({ type: 'ARC', cx, cy, r, a0, a1: mid }) +
      arcSvg({ type: 'ARC', cx, cy, r, a0: mid, a1 })
    )
  }
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  const large = Math.abs(delta) > Math.PI ? 1 : 0
  const sweep = delta > 0 ? 1 : 0
  return `A${f(r)},${f(r)} 0 ${large} ${sweep} ${f(x1)},${f(y1)}`
}

/** Serialize commands to an SVG path `d` string. */
export function pathToSvg(cmds: PathCommand[]): string {
  let d = ''
  for (const c of cmds) {
    switch (c.type) {
      case 'M':
        d += `M${f(c.x)},${f(c.y)}`
        break
      case 'L':
        d += `L${f(c.x)},${f(c.y)}`
        break
      case 'C':
        d += `C${f(c.x1)},${f(c.y1)} ${f(c.x2)},${f(c.y2)} ${f(c.x)},${f(c.y)}`
        break
      case 'Q':
        d += `Q${f(c.x1)},${f(c.y1)} ${f(c.x)},${f(c.y)}`
        break
      case 'ARC':
        d += arcSvg(c)
        break
      case 'Z':
        d += 'Z'
        break
    }
  }
  return d
}

/** Replay commands onto a Canvas2D context (path only — caller fills/strokes). */
export function pathToCanvas(
  cmds: PathCommand[],
  ctx: {
    moveTo(x: number, y: number): void
    lineTo(x: number, y: number): void
    bezierCurveTo(a: number, b: number, c: number, d: number, e: number, f: number): void
    quadraticCurveTo(a: number, b: number, c: number, d: number): void
    arc(cx: number, cy: number, r: number, a0: number, a1: number, ccw?: boolean): void
    closePath(): void
    beginPath(): void
  }
): void {
  ctx.beginPath()
  for (const c of cmds) {
    switch (c.type) {
      case 'M':
        ctx.moveTo(c.x, c.y)
        break
      case 'L':
        ctx.lineTo(c.x, c.y)
        break
      case 'C':
        ctx.bezierCurveTo(c.x1, c.y1, c.x2, c.y2, c.x, c.y)
        break
      case 'Q':
        ctx.quadraticCurveTo(c.x1, c.y1, c.x, c.y)
        break
      case 'ARC':
        ctx.arc(c.cx, c.cy, c.r, c.a0, c.a1, c.a1 < c.a0)
        break
      case 'Z':
        ctx.closePath()
        break
    }
  }
}

/** Small fluent builder so generators read cleanly. */
export class PathBuilder {
  cmds: PathCommand[] = []
  moveTo(x: number, y: number) {
    this.cmds.push({ type: 'M', x, y })
    return this
  }
  lineTo(x: number, y: number) {
    this.cmds.push({ type: 'L', x, y })
    return this
  }
  curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
    this.cmds.push({ type: 'C', x1, y1, x2, y2, x, y })
    return this
  }
  arc(cx: number, cy: number, r: number, a0: number, a1: number) {
    this.cmds.push({ type: 'ARC', cx, cy, r, a0, a1 })
    return this
  }
  close() {
    this.cmds.push({ type: 'Z' })
    return this
  }
  toSvg() {
    return pathToSvg(this.cmds)
  }
}
