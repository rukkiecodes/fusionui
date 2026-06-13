/**
 * FusionUI gooey engine — core types
 *
 * "Gooey" is two separable things, and doing both correctly is what makes
 * this an engine rather than a CSS blur trick:
 *
 *   1. GEOMETRY — a metaball scalar field. Each blob contributes a smooth
 *      falloff; the surface is the isocontour where the summed field crosses
 *      a threshold. Where two blobs' fields overlap, the sum clears the
 *      threshold in the gap and the surface bridges — that bridge IS the goo.
 *      We extract the real isosurface with marching squares (resolution-
 *      independent SVG paths), not blur+contrast.
 *
 *   2. DYNAMICS — how blobs move. Surface tension (cohesion pulling the fluid
 *      together), viscosity (velocity damping + neighbours dragging each
 *      other along), pressure (volume preservation), gravity, pointer forces.
 *      Integrated with a stable symplectic step.
 *
 * Plus an optional soft-body module: a pressurised spring-mass ring, so a
 * single blob can wobble and squish like a real droplet (gooey buttons).
 *
 * core/ is platform-agnostic. web/ renders the field with marching squares
 * (or an SVG goo filter); native/ renders it with a Skia runtime shader. The
 * physics is shared verbatim.
 */

/** A blob = a charged point in the field and a particle in the sim. */
export interface Blob {
  x: number
  y: number
  /** Velocity, px/s. */
  vx: number
  vy: number
  /** Visual radius px — the field is calibrated so the isosurface of a lone
   *  blob sits exactly at this radius for the active threshold. */
  r: number
  /** Mass for the integrator. Defaults to area (r²) if omitted. */
  mass?: number
  /** Pin to its current position (ignores forces, still charges the field). */
  pinned?: boolean
  /** Free-form id so callers can map blobs back to UI elements. */
  id?: string | number
}

export type GooKernel =
  /** (1 - (d/R)²)³ — smooth, finite support, C². The controllable default. */
  | 'cubic'
  /** exp(-(d/σ)²) — softest, slight infinite tail (cut at 3σ). */
  | 'gaussian'
  /** T·r²/d² — Blinn's classic, long range, very liquid, infinite support. */
  | 'inverseSquare'

export interface FieldParams {
  kernel: GooKernel
  /**
   * Isosurface level. The field is normalised so a lone blob renders at its
   * visual radius for ANY threshold — so this knob controls MERGE REACH, not
   * blob size. Lower = blobs reach for each other from further away (gooier);
   * higher = they only merge when nearly touching.
   * cubic/gaussian: 0..1. inverseSquare: typically 1.
   */
  threshold: number
}

export interface PhysicsParams {
  /** Surface-tension strength: stiffness of the spring pulling blobs to their
   *  rest overlap. */
  cohesion: number
  /** Range over which cohesion acts, in multiples of summed radii. */
  cohesionRange: number
  /** Rest centre-distance as a fraction of summed radii. < 1 makes blobs
   *  overlap at rest so they visually MERGE; the spring rests exactly here. */
  restFactor: number
  /** Repulsion stiffness once blobs are closer than rest — this is what gives
   *  the fluid volume instead of collapsing to a point. */
  separationStiffness: number
  /** Long-range pull toward the group's centroid, /s². Makes scattered blobs
   *  coalesce into one body of goo (set 0 for free-floating). */
  gather: number
  /** Global velocity damping per second (0 = inviscid, high = molasses). */
  viscosity: number
  /** Neighbour velocity matching 0..1 (XSPH) — makes a clump move as one. */
  cohesionDamping: number
  /** Gravity px/s². */
  gravity: [number, number]
  /** Clamp on speed px/s for stability. */
  maxSpeed: number
}

export interface PointerForce {
  x: number
  y: number
  /** + attracts blobs, − repels them. */
  strength: number
  /** Falloff radius px. */
  radius: number
  active: boolean
}

export interface Bounds {
  width: number
  height: number
  /** Cushion blobs back inside the box. */
  contain: boolean
  /** Energy kept on bounce, 0..1. */
  restitution: number
}

export interface GooParams {
  field: FieldParams
  physics: PhysicsParams
  bounds: Bounds
}

export const DEFAULT_GOO_PARAMS: GooParams = {
  field: { kernel: 'cubic', threshold: 0.5 },
  physics: {
    cohesion: 45,
    cohesionRange: 2.0,
    restFactor: 0.82,
    separationStiffness: 7,
    gather: 4,
    viscosity: 1.4,
    cohesionDamping: 0.2,
    gravity: [0, 0],
    maxSpeed: 1400,
  },
  bounds: { width: 0, height: 0, contain: true, restitution: 0.2 },
}

export function resolveGooParams(p?: DeepPartial<GooParams>): GooParams {
  const physics = { ...DEFAULT_GOO_PARAMS.physics, ...p?.physics } as PhysicsParams
  if (p?.physics?.gravity) {
    const g = p.physics.gravity as number[]
    physics.gravity = [g[0] ?? 0, g[1] ?? 0]
  }
  return {
    field: { ...DEFAULT_GOO_PARAMS.field, ...p?.field },
    physics,
    bounds: { ...DEFAULT_GOO_PARAMS.bounds, ...p?.bounds },
  }
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

/** A closed contour loop in px space. */
export type Contour = Array<{ x: number; y: number }>
