/**
 * Pressurised soft-body droplet — the deformable-blob physics.
 *
 * The metaball system above moves blobs as rigid points. To make a SINGLE
 * blob wobble and squish like a real droplet (think a gooey button reacting
 * to a press), we model its perimeter as a spring-mass ring with an internal
 * pressure that resists area change:
 *
 *   • N mass points around a ring, neighbours joined by damped springs
 *     (the "skin", resisting stretch).
 *   • Internal pressure pushes every edge outward with force ∝ 1/Area, so the
 *     droplet inflates to an equilibrium where skin tension balances pressure
 *     and holds its volume. Squash it and the trapped "gas" pushes back; let
 *     go and it oscillates and settles — genuine soft-body behaviour, not a
 *     scripted bounce.
 *
 * (Matyka's 2D pressure soft-body model, with damping for stability.)
 *
 * Render it directly as a smooth path, or drop a metaball at each ring point
 * so several soft bodies merge gooily with each other.
 */

export interface SoftPoint {
  x: number
  y: number
  vx: number
  vy: number
}

export interface SoftBodyOptions {
  cx: number
  cy: number
  radius: number
  /** Ring resolution. 16–28 looks smooth and stays cheap. */
  points: number
  /** Skin stiffness (keeps points evenly spaced around the ring). */
  stiffness: number
  /** Skin spring damping (per-edge, along the edge). */
  damping: number
  /** Internal pressure stiffness. The droplet targets its rest area, so this
   *  sets how firmly it resists being squashed (bounciness), not its size. */
  pressure: number
  /** Global velocity damping /s — viscosity that lets a poke settle. */
  linearDamping: number
  /** Per-point mass. */
  mass: number
  gravity: [number, number]
}

export const DEFAULT_SOFTBODY: Omit<SoftBodyOptions, 'cx' | 'cy' | 'radius'> = {
  points: 22,
  stiffness: 240,
  damping: 4,
  pressure: 7000,
  linearDamping: 2.4,
  mass: 1,
  gravity: [0, 0],
}

export class SoftBody {
  points: SoftPoint[] = []
  restLength: number
  restArea: number
  opts: SoftBodyOptions

  constructor(options: Partial<SoftBodyOptions> & { cx: number; cy: number; radius: number }) {
    this.opts = { ...DEFAULT_SOFTBODY, ...options }
    const { cx, cy, radius, points } = this.opts
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2
      this.points.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius, vx: 0, vy: 0 })
    }
    this.restLength = (2 * Math.PI * radius) / points
    this.restArea = this.area() // the area the droplet will hold
  }

  /** Signed polygon area (shoelace). */
  area(): number {
    const p = this.points
    let a = 0
    for (let i = 0; i < p.length; i++) {
      const q = p[(i + 1) % p.length]
      a += p[i].x * q.y - q.x * p[i].y
    }
    return Math.abs(a) * 0.5
  }

  centroid(): [number, number] {
    let x = 0
    let y = 0
    for (const p of this.points) {
      x += p.x
      y += p.y
    }
    return [x / this.points.length, y / this.points.length]
  }

  /** Impulse at a world point, falling off with distance — e.g. a poke. */
  poke(px: number, py: number, strength: number, radius: number): void {
    for (const p of this.points) {
      const dx = p.x - px
      const dy = p.y - py
      const d = Math.hypot(dx, dy)
      if (d < radius && d > 1e-3) {
        const f = (strength * (1 - d / radius)) / d
        p.vx += dx * f
        p.vy += dy * f
      }
    }
  }

  step(dt: number): void {
    const p = this.points
    const n = p.length
    const o = this.opts
    const fx = new Float32Array(n)
    const fy = new Float32Array(n)

    // skin springs (damped) between consecutive points
    for (let i = 0; i < n; i++) {
      const a = p[i]
      const b = p[(i + 1) % n]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 1e-4
      const ux = dx / dist
      const uy = dy / dist
      const stretch = dist - this.restLength
      const relVel = (b.vx - a.vx) * ux + (b.vy - a.vy) * uy
      const f = o.stiffness * stretch + o.damping * relVel
      const j = (i + 1) % n
      fx[i] += ux * f
      fy[i] += uy * f
      fx[j] -= ux * f
      fy[j] -= uy * f
    }

    // internal pressure: a restoring force toward the droplet's REST AREA, so
    // it self-stabilises at its initial size regardless of stiffness. pres > 0
    // when squashed (push out), < 0 when over-inflated (pull in). Equilibrium
    // is A = restArea with pres = 0 — a true incompressible-ish droplet.
    const A = Math.max(this.area(), 1e-3)
    const pres = o.pressure * (this.restArea / A - 1)
    for (let i = 0; i < n; i++) {
      const a = p[i]
      const b = p[(i + 1) % n]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1e-4
      // outward normal of this edge (CCW ring → (dy,−dx) points outward)
      const nx = dy / len
      const ny = -dx / len
      const force = pres * len * 0.5
      fx[i] += nx * force
      fy[i] += ny * force
      const j = (i + 1) % n
      fx[j] += nx * force
      fy[j] += ny * force
    }

    const damp = Math.max(0, 1 - o.linearDamping * dt)
    for (let i = 0; i < n; i++) {
      const pt = p[i]
      pt.vx = (pt.vx + (fx[i] / o.mass + o.gravity[0]) * dt) * damp
      pt.vy = (pt.vy + (fy[i] / o.mass + o.gravity[1]) * dt) * damp
      pt.x += pt.vx * dt
      pt.y += pt.vy * dt
    }
  }

  /** Smooth closed path through the ring (Catmull-Rom → cubic Bézier). */
  toPath(): string {
    const p = this.points
    const n = p.length
    if (n < 3) return ''
    let d = `M${p[0].x.toFixed(2)},${p[0].y.toFixed(2)}`
    for (let i = 0; i < n; i++) {
      const p0 = p[(i - 1 + n) % n]
      const p1 = p[i]
      const p2 = p[(i + 1) % n]
      const p3 = p[(i + 2) % n]
      const c1x = p1.x + (p2.x - p0.x) / 6
      const c1y = p1.y + (p2.y - p0.y) / 6
      const c2x = p2.x - (p3.x - p1.x) / 6
      const c2y = p2.y - (p3.y - p1.y) / 6
      d += `C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
    }
    return d + 'Z'
  }
}
