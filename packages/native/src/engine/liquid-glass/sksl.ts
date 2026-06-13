/**
 * GPU backend — SKSL runtime shader for @shopify/react-native-skia.
 *
 * This is the SAME physics as geometry.ts / surface.ts / refraction.ts,
 * transliterated to SKSL so Android and pre-iOS-26 devices evaluate it per
 * pixel on the GPU. Keep the two in sync — the function names match 1:1.
 *
 * Uniform contract (see makeGlassUniforms):
 *   u_size   : slab size in px
 *   u_radius : corner radius px
 *   u_bezel  : bezel width px
 *   u_depth  : slab thickness px
 *   u_ior    : index of refraction
 *   u_ca     : chromatic aberration 0..1
 *   u_spec   : (intensity, shininess)
 *   u_light  : normalized light direction
 *   u_profile: 0 = lens, 1 = smooth
 */

import { resolveOptions } from './types'
import type { GlassGeometry, GlassOptions } from './types'

export const GLASS_SKSL = /* sksl */ `
uniform shader image;        // the backdrop being refracted
uniform float2 u_size;
uniform float  u_radius;
uniform float  u_bezel;
uniform float  u_depth;
uniform float  u_ior;
uniform float  u_ca;
uniform float2 u_spec;       // x: intensity, y: shininess
uniform float3 u_light;
uniform float  u_profile;

// --- geometry.ts: sdRoundedBox -------------------------------------------
float sdRoundedBox(float2 p, float2 b, float r) {
  float2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// --- surface.ts: bezelProfile --------------------------------------------
// returns (h, dh/dt)
float2 bezelProfile(float t) {
  t = clamp(t, 0.0, 1.0);
  if (u_profile < 0.5) {            // lens: quarter circle
    float u = 1.0 - t;
    float h = sqrt(max(1.0 - u * u, 0.0));
    return float2(h, min(u / max(h, 1e-3), 8.0));
  }
  return float2(t * t * (3.0 - 2.0 * t), 6.0 * t * (1.0 - t)); // smoothstep
}

// --- surface.ts: surfaceNormal -------------------------------------------
// returns normal (xyz). Height isn't needed separately: travel = u_depth.
float3 surfaceNormal(float d, float2 g) {
  float t = -d / max(u_bezel, 1e-3);
  float2 hp = bezelProfile(t);
  float s = (u_depth / max(u_bezel, 1e-3)) * hp.y;
  // ∇H = -s·∇sdf ; n = normalize(-∇H, 1) = normalize(s·∇sdf, 1)
  return normalize(float3(g * s, 1.0));
}

// --- refraction.ts: refractDisplacement ----------------------------------
float2 refractDisplacement(float3 n, float ior) {
  float eta = 1.0 / ior;
  float cosi = n.z;                         // -dot(n, (0,0,-1))
  float k = 1.0 - eta * eta * (1.0 - cosi * cosi);
  if (k <= 0.0) return float2(0.0);
  float f = eta * cosi - sqrt(k);
  float2 txy = f * n.xy;
  float tz = -eta + f * n.z;                // < 0, downward
  return txy * (u_depth / max(-tz, 1e-4));
}

// --- refraction.ts: specularIntensity ------------------------------------
float specularIntensity(float3 n) {
  float3 hv = normalize(float3(-u_light.xy, -u_light.z + 1.0));
  float nh = max(dot(n, hv), 0.0);
  float rim = 1.0 - n.z * n.z;
  return pow(nh, u_spec.y) * u_spec.x * min(rim * 6.0, 1.0);
}

half4 main(float2 xy) {
  float2 b = u_size * 0.5;
  float2 p = xy - b;
  float r = min(u_radius, min(b.x, b.y));
  float d = sdRoundedBox(p, b, r);

  if (d > 0.0) return image.eval(xy);            // outside (clipped anyway)

  float bezel = min(u_bezel, min(b.x, b.y));
  if (-d > bezel) return image.eval(xy);         // flat plateau: no bend

  // numeric SDF gradient (matches sdRoundedBoxGradient, eps = 0.5)
  float e = 0.5;
  float2 g = normalize(float2(
    sdRoundedBox(p + float2(e, 0.0), b, r) - sdRoundedBox(p - float2(e, 0.0), b, r),
    sdRoundedBox(p + float2(0.0, e), b, r) - sdRoundedBox(p - float2(0.0, e), b, r)
  ));

  float3 n = surfaceNormal(d, g);

  // Chromatic aberration: red bends a touch less, blue a touch more.
  float spread = u_ca * 0.04;
  float2 dR = refractDisplacement(n, u_ior * (1.0 - spread));
  float2 dG = refractDisplacement(n, u_ior);
  float2 dB = refractDisplacement(n, u_ior * (1.0 + spread));

  half4 c = half4(
    image.eval(xy + dR).r,
    image.eval(xy + dG).g,
    image.eval(xy + dB).b,
    1.0
  );

  // rim highlight
  c.rgb += half3(specularIntensity(n));
  return c;
}
`

/** Flat uniform object matching the SKSL contract above. */
export function makeGlassUniforms(
  geometry: GlassGeometry,
  options?: Partial<GlassOptions>
): Record<string, number | number[]> {
  const o = resolveOptions(options)
  return {
    u_size: [geometry.width, geometry.height],
    u_radius: geometry.radius,
    u_bezel: o.bezelWidth,
    u_depth: o.depth,
    u_ior: o.ior,
    u_ca: o.chromaticAberration,
    u_spec: [o.specular.intensity, o.specular.shininess],
    u_light: o.specular.lightDir,
    u_profile: o.profile === 'lens' ? 0 : 1,
  }
}
