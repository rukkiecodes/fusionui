/**
 * Marching squares — extract the metaball isosurface as closed SVG contours.
 *
 * This is the honest version of "gooey". A blur-then-threshold filter fakes
 * the look in screen space; this computes the actual level set of the field
 * on a grid and stitches the crossings into closed loops. The result is
 * resolution-independent vector geometry: zoom in and the goo stays crisp,
 * and the bridges between merging blobs are real surface, not bloom.
 *
 * Robust stitching trick: every contour vertex lies on a specific grid edge,
 * and the interpolated point on a shared edge is identical from both adjacent
 * cells. So we KEY vertices by edge identity (not float coords) and walk the
 * resulting graph into loops — no epsilon matching, no cracks.
 */

import { fieldAt, type FieldKernelCache } from './field'
import type { Blob, Contour } from './types'

export interface MarchConfig {
  width: number
  height: number
  /** Grid cell size px. 6–10 is a good range; smaller = smoother + slower. */
  cell: number
}

interface Crossing {
  key: number
  x: number
  y: number
}

/**
 * Sample the field on a grid and march. The outermost ring of samples is
 * forced "outside" so contours always close cleanly at the box edge.
 */
export function fieldToContours(
  blobs: Blob[],
  cache: FieldKernelCache,
  cfg: MarchConfig
): Contour[] {
  const cell = Math.max(2, cfg.cell)
  const nx = Math.max(2, Math.ceil(cfg.width / cell))
  const ny = Math.max(2, Math.ceil(cfg.height / cell))
  const gw = nx + 1
  const gh = ny + 1
  const T = cache.threshold

  // sample grid (with forced-outside border)
  const f = new Float32Array(gw * gh)
  for (let j = 0; j < gh; j++) {
    const y = j * cell
    for (let i = 0; i < gw; i++) {
      const idx = j * gw + i
      if (i === 0 || j === 0 || i === gw - 1 || j === gh - 1) {
        f[idx] = -1 // border: definitively outside
      } else {
        f[idx] = fieldAt(i * cell, y, blobs, cache) - T
      }
    }
  }

  // unique key per grid edge: horizontals first, then verticals
  const hBase = 0
  const vBase = gw * gh
  const hKey = (i: number, j: number) => hBase + j * gw + i // edge (i,j)-(i+1,j)
  const vKey = (i: number, j: number) => vBase + j * gw + i // edge (i,j)-(i,j+1)

  const interp = (a: number, b: number) => a / (a - b) // crossing fraction where f=0

  // graph of segments keyed by crossing
  const adjacency = new Map<number, Crossing[]>()
  const link = (p: Crossing, q: Crossing) => {
    ;(adjacency.get(p.key) ?? adjacency.set(p.key, []).get(p.key)!).push(q)
    ;(adjacency.get(q.key) ?? adjacency.set(q.key, []).get(q.key)!).push(p)
  }
  const points = new Map<number, Crossing>()
  const pt = (key: number, x: number, y: number): Crossing => {
    let p = points.get(key)
    if (!p) {
      p = { key, x, y }
      points.set(key, p)
    }
    return p
  }

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const v0 = f[j * gw + i] // TL
      const v1 = f[j * gw + i + 1] // TR
      const v2 = f[(j + 1) * gw + i + 1] // BR
      const v3 = f[(j + 1) * gw + i] // BL
      let mask = 0
      if (v0 >= 0) mask |= 1
      if (v1 >= 0) mask |= 2
      if (v2 >= 0) mask |= 4
      if (v3 >= 0) mask |= 8
      if (mask === 0 || mask === 15) continue

      const x = i * cell
      const y = j * cell
      // crossing point on each edge, computed identically from either cell
      const top = () => pt(hKey(i, j), x + interp(v0, v1) * cell, y)
      const right = () => pt(vKey(i + 1, j), x + cell, y + interp(v1, v2) * cell)
      const bottom = () => pt(hKey(i, j + 1), x + interp(v3, v2) * cell, y + cell)
      const left = () => pt(vKey(i, j), x, y + interp(v0, v3) * cell)

      switch (mask) {
        case 1:
        case 14:
          link(left(), top())
          break
        case 2:
        case 13:
          link(top(), right())
          break
        case 4:
        case 11:
          link(right(), bottom())
          break
        case 8:
        case 7:
          link(bottom(), left())
          break
        case 3:
        case 12:
          link(left(), right())
          break
        case 6:
        case 9:
          link(top(), bottom())
          break
        case 5:
        case 10: {
          // saddle — resolve with the cell-centre value
          const centre = (v0 + v1 + v2 + v3) * 0.25
          if ((mask === 5) === centre >= 0) {
            link(left(), top())
            link(right(), bottom())
          } else {
            link(top(), right())
            link(bottom(), left())
          }
          break
        }
      }
    }
  }

  // walk the graph into closed loops
  const loops: Contour[] = []
  const visited = new Set<string>()
  const edgeId = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)

  for (const start of points.values()) {
    const neighbours = adjacency.get(start.key)
    if (!neighbours) continue
    for (const first of neighbours) {
      if (visited.has(edgeId(start.key, first.key))) continue
      const loop: Contour = [{ x: start.x, y: start.y }]
      let prev = start
      let cur = first
      visited.add(edgeId(start.key, first.key))
      let guard = 0
      while (cur.key !== start.key && guard++ < 100000) {
        loop.push({ x: cur.x, y: cur.y })
        const ns = adjacency.get(cur.key)!
        const next = ns.find(n => n.key !== prev.key && !visited.has(edgeId(cur.key, n.key)))
        if (!next) break
        visited.add(edgeId(cur.key, next.key))
        prev = cur
        cur = next
      }
      if (loop.length >= 3) loops.push(loop)
    }
  }
  return loops
}

/** Chaikin corner-cutting: turns the polyline into a smooth liquid edge. */
export function smoothContour(loop: Contour, iterations = 2): Contour {
  let pts = loop
  for (let k = 0; k < iterations; k++) {
    const out: Contour = []
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % n]
      out.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 })
      out.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 })
    }
    pts = out
  }
  return pts
}

/** Contours → one SVG path string (fill-rule nonzero handles any nesting). */
export function contoursToPath(loops: Contour[], smoothing = 2): string {
  let d = ''
  for (const raw of loops) {
    const loop = smoothing > 0 ? smoothContour(raw, smoothing) : raw
    if (loop.length < 3) continue
    d += `M${loop[0].x.toFixed(2)},${loop[0].y.toFixed(2)}`
    for (let i = 1; i < loop.length; i++) d += `L${loop[i].x.toFixed(2)},${loop[i].y.toFixed(2)}`
    d += 'Z'
  }
  return d
}
