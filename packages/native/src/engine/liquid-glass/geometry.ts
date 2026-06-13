/**
 * Signed distance field for a rounded rectangle.
 *
 * The SDF is the backbone of the whole effect: distance-to-edge drives the
 * bezel height profile, and the SDF gradient gives the direction the surface
 * tilts in, which becomes the refraction direction.
 *
 * Convention: p is relative to the CENTER of the rect. d < 0 inside, 0 on the
 * edge, > 0 outside.
 */

/**
 * Exact SDF of a rounded box (Inigo Quilez formulation).
 * @param px,py  point relative to center
 * @param bx,by  half-extents
 * @param r      corner radius
 */
export function sdRoundedBox(px: number, py: number, bx: number, by: number, r: number): number {
  const qx = Math.abs(px) - bx + r
  const qy = Math.abs(py) - by + r
  const ox = Math.max(qx, 0)
  const oy = Math.max(qy, 0)
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(ox, oy) - r
}

/**
 * Gradient of the SDF (unit vector pointing toward the nearest edge, i.e.
 * "outward"). Central differences — cheap, robust at the corner seams where
 * the analytic gradient is piecewise.
 */
export function sdRoundedBoxGradient(
  px: number,
  py: number,
  bx: number,
  by: number,
  r: number,
  eps = 0.5
): [number, number] {
  const gx = sdRoundedBox(px + eps, py, bx, by, r) - sdRoundedBox(px - eps, py, bx, by, r)
  const gy = sdRoundedBox(px, py + eps, bx, by, r) - sdRoundedBox(px, py - eps, bx, by, r)
  const l = Math.hypot(gx, gy) || 1
  return [gx / l, gy / l]
}

/** Clamp a requested corner radius to what the geometry can hold. */
export function clampRadius(width: number, height: number, radius: number): number {
  return Math.max(0, Math.min(radius, Math.min(width, height) / 2))
}
