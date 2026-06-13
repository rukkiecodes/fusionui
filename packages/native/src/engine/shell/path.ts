// Renderer-agnostic path commands + the Skia materialiser. Mirrors the web
// engine's PathCommand contract so the SAME shell geometry (engine/shell) draws
// as an SVG <path> on web and an SkPath here on native.

export type PathCommand =
  | { type: 'M'; x: number; y: number }
  | { type: 'L'; x: number; y: number }
  | { type: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { type: 'Q'; x1: number; y1: number; x: number; y: number }
  | { type: 'ARC'; cx: number; cy: number; r: number; a0: number; a1: number }
  | { type: 'Z' }

// `Skia` is the runtime object from @shopify/react-native-skia, typed loosely so
// the engine doesn't hard-depend on the native package.
interface SkiaLike {
  Path: { Make(): SkPathLike }
}
interface SkPathLike {
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  cubicTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void
  quadTo(x1: number, y1: number, x: number, y: number): void
  addArc(
    oval: { x: number; y: number; width: number; height: number },
    startDeg: number,
    sweepDeg: number
  ): void
  close(): void
}

const RAD2DEG = 180 / Math.PI

/** Replay PathCommands into a Skia SkPath. Arc → addArc on the bounding oval. */
export function buildSkiaPath(Skia: SkiaLike, cmds: PathCommand[]): SkPathLike {
  const p = Skia.Path.Make()
  for (const c of cmds) {
    switch (c.type) {
      case 'M':
        p.moveTo(c.x, c.y)
        break
      case 'L':
        p.lineTo(c.x, c.y)
        break
      case 'C':
        p.cubicTo(c.x1, c.y1, c.x2, c.y2, c.x, c.y)
        break
      case 'Q':
        p.quadTo(c.x1, c.y1, c.x, c.y)
        break
      case 'ARC': {
        const oval = { x: c.cx - c.r, y: c.cy - c.r, width: c.r * 2, height: c.r * 2 }
        p.addArc(oval, c.a0 * RAD2DEG, (c.a1 - c.a0) * RAD2DEG)
        break
      }
      case 'Z':
        p.close()
        break
    }
  }
  return p
}
