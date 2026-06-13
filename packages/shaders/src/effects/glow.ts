import type { ShaderEffect } from '../types'
import { PREAMBLE } from './gradient'

/** Soft pulsing glow — draws the eye to a primary action or status. */
export const glow: ShaderEffect = {
  name: 'glow',
  usesPointer: false,
  rationale: 'A slow breathing glow signals "alive / important" without a hard animation.',
  frag: `${PREAMBLE}
void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
  float d = length(p);
  float pulse = 0.6 + 0.4 * sin(u_time * 1.5);
  float g = smoothstep(0.75, 0.0, d) * pulse;
  vec3 col = mix(u_colorB, u_colorA, g);
  o = vec4(col, g * u_intensity);
}`,
  fallback(colorA, colorB, intensity) {
    return {
      backgroundImage: `radial-gradient(circle at 50% 50%, ${colorA}, ${colorB} 70%)`,
      opacity: String(intensity),
    }
  },
}
