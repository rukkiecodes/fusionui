/**
 * Blob dynamics — the "physics" half of gooey.
 *
 * Forces, per step:
 *  • Cohesion (surface tension): near blobs pull toward each other so the
 *    fluid clumps and minimises surface — the reason goo holds together.
 *  • Separation: a short-range push so the clump keeps volume instead of
 *    collapsing onto one point (incompressibility, roughly).
 *  • Cohesion damping (XSPH): near blobs match velocities, so a blob of goo
 *    travels as one body rather than a cloud of independent dots.
 *  • Viscosity: global velocity damping.
 *  • Gravity + pointer + walls.
 *
 * Integrated with semi-implicit (symplectic) Euler: update velocity from
 * forces, damp, then advance position. Stable for stiff cohesion at the
 * frame rates a UI runs at, and we clamp speed as a backstop.
 */

import type { Blob, Bounds, PhysicsParams, PointerForce } from './types'

const massOf = (b: Blob) => b.mass ?? b.r * b.r

export interface StepContext {
  physics: PhysicsParams
  bounds: Bounds
  pointer?: PointerForce
}

export function stepBlobs(blobs: Blob[], ctx: StepContext, dt: number): void {
  const { physics: P, bounds, pointer } = ctx
  const n = blobs.length
  const fx = new Float32Array(n)
  const fy = new Float32Array(n)

  // centroid (for the long-range gather pull)
  let cx = 0
  let cy = 0
  if (P.gather > 0 && n > 0) {
    for (let i = 0; i < n; i++) {
      cx += blobs[i].x
      cy += blobs[i].y
    }
    cx /= n
    cy /= n
  }

  // pairwise: an ASYMMETRIC spring whose rest length is restFactor·(rA+rB).
  // Beyond rest → attraction (tapered to zero at cohesionRange, so no force
  // pop at the boundary). Inside rest → stiff repulsion (keeps volume). The
  // spring rests exactly at restFactor·sumR, so blobs settle overlapping and
  // therefore visually merge.
  for (let i = 0; i < n; i++) {
    const a = blobs[i]
    for (let j = i + 1; j < n; j++) {
      const b = blobs[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      let dist = Math.hypot(dx, dy)
      if (dist < 1e-4) dist = 1e-4
      const ux = dx / dist
      const uy = dy / dist
      const sumR = a.r + b.r
      const range = sumR * P.cohesionRange
      const rest = sumR * P.restFactor

      let f = 0
      if (dist > rest) {
        if (dist < range) {
          const taper = 1 - (dist - rest) / (range - rest) // 1 at rest → 0 at range
          f = P.cohesion * (dist - rest) * taper // attraction (+ pulls together)
        }
      } else {
        f = -P.cohesion * P.separationStiffness * (rest - dist) // repulsion (−)
      }

      const fxs = ux * f
      const fys = uy * f
      fx[i] += fxs
      fy[i] += fys
      fx[j] -= fxs
      fy[j] -= fys

      // XSPH velocity matching within range — clump moves as one body
      if (P.cohesionDamping > 0 && dist < range) {
        const w = P.cohesionDamping * (1 - dist / range)
        const dvx = (b.vx - a.vx) * w
        const dvy = (b.vy - a.vy) * w
        a.vx += dvx
        a.vy += dvy
        b.vx -= dvx
        b.vy -= dvy
      }
    }
  }

  // pointer force
  if (pointer?.active) {
    for (let i = 0; i < n; i++) {
      const b = blobs[i]
      const dx = pointer.x - b.x
      const dy = pointer.y - b.y
      const dist = Math.hypot(dx, dy)
      if (dist < pointer.radius && dist > 1e-3) {
        const falloff = 1 - dist / pointer.radius
        const f = (pointer.strength * falloff) / dist
        fx[i] += dx * f
        fy[i] += dy * f
      }
    }
  }

  const damp = Math.max(0, 1 - P.viscosity * dt)
  for (let i = 0; i < n; i++) {
    const b = blobs[i]
    if (b.pinned) {
      b.vx = 0
      b.vy = 0
      continue
    }
    const m = massOf(b)
    // gather is an acceleration (mass-independent) so all blobs coalesce alike
    const gax = P.gather > 0 ? P.gather * (cx - b.x) : 0
    const gay = P.gather > 0 ? P.gather * (cy - b.y) : 0
    b.vx = (b.vx + (fx[i] / m + P.gravity[0] + gax) * dt) * damp
    b.vy = (b.vy + (fy[i] / m + P.gravity[1] + gay) * dt) * damp

    const sp = Math.hypot(b.vx, b.vy)
    if (sp > P.maxSpeed) {
      const s = P.maxSpeed / sp
      b.vx *= s
      b.vy *= s
    }

    b.x += b.vx * dt
    b.y += b.vy * dt

    if (bounds.contain && bounds.width > 0 && bounds.height > 0) {
      const e = bounds.restitution
      if (b.x < b.r) {
        b.x = b.r
        b.vx = Math.abs(b.vx) * e
      } else if (b.x > bounds.width - b.r) {
        b.x = bounds.width - b.r
        b.vx = -Math.abs(b.vx) * e
      }
      if (b.y < b.r) {
        b.y = b.r
        b.vy = Math.abs(b.vy) * e
      } else if (b.y > bounds.height - b.r) {
        b.y = bounds.height - b.r
        b.vy = -Math.abs(b.vy) * e
      }
    }
  }
}
