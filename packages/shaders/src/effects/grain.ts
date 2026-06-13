import type { ShaderEffect } from '../types'
import { PREAMBLE } from './gradient'

/** Film grain — a fine animated noise that warms flat digital surfaces. */
export const grain: ShaderEffect = {
  name: 'grain',
  usesPointer: false,
  rationale: 'A whisper of moving grain stops large flat fills reading as dead pixels.',
  frag: `${PREAMBLE}
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
void main() {
  vec2 cell = floor(v_uv * u_resolution);
  float n = hash(cell + floor(u_time * 24.0));
  vec3 tint = mix(u_colorA, u_colorB, n);
  o = vec4(tint, n * u_intensity);
}`,
  fallback(colorA, _colorB, intensity) {
    // SVG fractal noise — a real static grain that renders in every engine.
    const svg =
      `%3Csvg xmlns='http://www.w3.org/2000/svg'%3E` +
      `%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E` +
      `%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${intensity}'/%3E%3C/svg%3E`
    return {
      backgroundColor: colorA,
      backgroundImage: `url("data:image/svg+xml,${svg}")`,
    }
  },
}
