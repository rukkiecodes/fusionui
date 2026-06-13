// Fluid "negative radius" junction.
//
// Where a navbar's bottom edge and a sidebar's right edge meet the recessed
// content, the shell should flow into the corner with a soft *concave* fillet —
// a negative radius — rather than a hard inside corner. The operator that does
// this is the **smooth minimum** (`smin`) of the two edge SDFs, which is exactly
// the metaball merge from the fusion-goo engine. So the corner is the gooey
// blend of two perpendicular surfaces.

/** Polynomial smooth-min (Inigo Quilez). `k` is the blend radius in px. */
export function smin(a: number, b: number, k: number): number {
  if (k <= 0) return Math.min(a, b)
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - h * h * k * 0.25
}

/**
 * SVG path for the shell-coloured fillet that sits in the junction corner, in a
 * local box of `size`×`size` whose (0,0) is the junction point and whose content
 * fills the bottom-right. Fill it with the **shell colour**: it occupies only the
 * small wedge between the corner and a quarter-round, so the content beneath
 * reads with a clean **convex** rounded corner nestled into the shell — i.e. the
 * *shell's* inside corner carries the negative (concave) radius, which is how the
 * navbar + sidebar frame flows around the content (the Vuesax look).
 *
 * The curve is a quarter arc centred at (size, size); the cubic controls sit one
 * `smin`-blend in from the axes so it stays crisp and resolution-independent.
 */
export function gooCornerPath(size: number): string {
  const s = Math.max(size, 0)
  // 0.4477 = 1 − 0.5523 (the quarter-circle Bézier constant) → controls one blend
  // in from each axis, giving the content's convex corner / shell's concave fillet.
  const c = s * 0.4477
  return `M0 0 L${s} 0 C${c} 0 0 ${c} 0 ${s} Z`
}
