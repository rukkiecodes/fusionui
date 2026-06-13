import type { ShaderEffect } from '../types'
import { PREAMBLE } from './gradient'

/** Hover displacement — a striped field that bulges toward the cursor. */
export const displace: ShaderEffect = {
  name: 'displace',
  usesPointer: true,
  rationale: 'Pointer-tracking refraction makes a surface feel physical and responsive on hover.',
  frag: `${PREAMBLE}
void main() {
  vec2 uv = v_uv;
  vec2 dir = uv - u_pointer;
  float d = length(dir);
  float infl = smoothstep(0.45, 0.0, d);
  uv -= normalize(dir + 1e-4) * infl * 0.12;
  float s = 0.5 + 0.5 * sin((uv.x + uv.y) * 16.0 + u_time * 1.2);
  vec3 col = mix(u_colorA, u_colorB, s);
  col += infl * 0.15; // brighten the bulge under the cursor
  o = vec4(col, u_intensity);
}`,
  fallback(colorA, colorB, intensity) {
    return {
      backgroundImage: `repeating-linear-gradient(45deg, ${colorA}, ${colorB} 12px, ${colorA} 24px)`,
      opacity: String(intensity),
    }
  },
}
