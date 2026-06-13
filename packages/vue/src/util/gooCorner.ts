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
 * SVG path for the shell-side of a fluid concave corner, in a local box of
 * `size`×`size` whose (0,0) is the junction point and whose content fills the
 * bottom-right. Fill the path with the **shell colour** to carve the negative
 * radius into the content beneath it.
 *
 * The curve is the `smin` isoline of the navbar-bottom (y=0) and sidebar-right
 * (x=0) edges: it leaves the axes at `size` and bows in to ~`size/4` at the
 * diagonal (a cubic Bézier matches that midpoint, so the path stays crisp and
 * resolution-independent without per-frame sampling).
 */
export function gooCornerPath(size: number): string {
  const s = Math.max(size, 0)
  // The shell bulges into the content corner along a quarter arc centred on the
  // junction (0,0): the content edge curves *away* from the corner, a concave
  // negative radius. 0.5523 is the circle Bézier constant for a true quarter arc.
  const k = s * 0.5523
  return `M0 0 L${s} 0 C${s} ${k} ${k} ${s} 0 ${s} Z`
}
