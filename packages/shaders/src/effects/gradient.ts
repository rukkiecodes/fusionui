import type { ShaderEffect } from '../types'

// Shared GLSL ES 3.00 preamble. Unused uniforms link out harmlessly (their
// location resolves to null and the runtime's uniform calls become no-ops).
export const PREAMBLE = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform float u_intensity;
`

/** Animated flowing gradient — depth and life behind hero surfaces. */
export const gradient: ShaderEffect = {
  name: 'gradient',
  usesPointer: false,
  rationale: 'A slow living gradient gives a hero surface depth a flat fill cannot.',
  frag: `${PREAMBLE}
void main() {
  float t = u_time * 0.12;
  float g = v_uv.x * 0.55 + v_uv.y * 0.45;
  g += 0.18 * sin(v_uv.y * 6.2831 + t * 2.0) + 0.18 * cos(v_uv.x * 6.2831 - t * 1.6);
  float m = 0.5 + 0.5 * sin(g * 3.14159 + t * 1.3);
  vec3 col = mix(u_colorA, u_colorB, clamp(m, 0.0, 1.0));
  o = vec4(col, u_intensity);
}`,
  fallback(colorA, colorB, intensity) {
    return {
      backgroundImage: `linear-gradient(135deg, ${colorA}, ${colorB})`,
      opacity: String(intensity),
    }
  },
}
