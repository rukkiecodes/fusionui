/**
 * FusionUI liquid glass — core types
 *
 * Everything in `core/` is platform-agnostic TypeScript. No DOM, no React
 * Native, no Vue. The web adapter rasterizes these equations on the CPU into
 * an SVG displacement map; the native adapter ships the same equations to the
 * GPU as an SKSL runtime shader. One physics model, two backends.
 */

/** Pixel-space geometry of the glass slab. */
export interface GlassGeometry {
  /** Element width in px (CSS px on web, dp on native). */
  width: number
  /** Element height in px. */
  height: number
  /** Corner radius in px. Clamped to half the short side. */
  radius: number
}

/** Bezel cross-section profile. */
export type BezelProfile =
  /** Circular lens cross-section — the iOS 26 look. Strong bend at the rim. */
  | 'lens'
  /** Smoothstep ease — softer, subtler edge bend. */
  | 'smooth'

export interface SpecularOptions {
  /** 0..1 strength of the rim highlight. */
  intensity: number
  /** Phong exponent. Higher = tighter, glassier highlight. */
  shininess: number
  /** Normalized light direction, pointing FROM the light TOWARD the surface.
   *  Default is upper-left key light, matching iOS. */
  lightDir: [number, number, number]
}

export interface GlassPhysics {
  /**
   * Width of the refractive rim in px. Inside this band the surface curves
   * like the edge of a lens; past it the slab is flat and the backdrop passes
   * through undistorted (that's why liquid glass is readable in the middle).
   */
  bezelWidth: number
  /**
   * Glass thickness in px. The refracted ray travels this far before hitting
   * the backdrop, so depth directly scales how far light is bent.
   */
  depth: number
  /** Index of refraction. Air = 1, water = 1.33, glass ≈ 1.45–1.52. */
  ior: number
  /** Bezel cross-section. */
  profile: BezelProfile
  /**
   * 0..1 chromatic aberration. Splits R/G/B by slightly different IORs at the
   * rim. GPU (Skia) path only — the SVG path uses a single displacement map.
   */
  chromaticAberration: number
  /** Rim highlight. */
  specular: SpecularOptions
}

/** Cosmetic layers applied around the refraction (per-platform units). */
export interface GlassStyle {
  /** Backdrop blur radius in px applied before refraction. */
  blur: number
  /** Backdrop saturation multiplier (1 = unchanged). iOS uses ~1.6–1.9. */
  saturation: number
  /** Tint laid over the glass, e.g. 'rgba(255,255,255,0.12)'. */
  tint: string
}

export interface GlassOptions extends GlassPhysics, GlassStyle {}

export const DEFAULT_GLASS_OPTIONS: GlassOptions = {
  bezelWidth: 18,
  depth: 14,
  ior: 1.45,
  profile: 'lens',
  chromaticAberration: 0.35,
  specular: {
    intensity: 0.65,
    shininess: 28,
    lightDir: normalize3(-0.45, -0.7, 0.55),
  },
  blur: 2,
  saturation: 1.6,
  tint: 'rgba(255,255,255,0.10)',
}

export function resolveOptions(partial?: Partial<GlassOptions>): GlassOptions {
  return {
    ...DEFAULT_GLASS_OPTIONS,
    ...partial,
    specular: { ...DEFAULT_GLASS_OPTIONS.specular, ...partial?.specular },
  }
}

export function normalize3(x: number, y: number, z: number): [number, number, number] {
  const l = Math.hypot(x, y, z) || 1
  return [x / l, y / l, z / l]
}

/** Result of CPU rasterization (web path). */
export interface GlassFieldMaps {
  width: number
  height: number
  /** Supersampling scale the maps were rendered at. */
  scale: number
  /**
   * RGBA displacement map for SVG <feDisplacementMap>.
   * R encodes x-displacement, G encodes y-displacement, both biased around
   * 127.5 so that "no displacement" is mid-gray.
   */
  displacement: Uint8ClampedArray
  /**
   * Peak displacement magnitude in px. Feed `2 * maxDisplacement` into the
   * filter's `scale` attribute so the 0..255 encoding maps back to px.
   */
  maxDisplacement: number
  /** RGBA premultiplied-looking highlight overlay (white, alpha = specular). */
  highlight: Uint8ClampedArray
}
