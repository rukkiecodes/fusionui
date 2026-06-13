// Public contracts shared by the runtime, the effect catalog and the component.

/** Mutable per-frame inputs the component feeds the runtime. */
export interface ShaderValues {
  /** rgb 0..1. */
  colorA: [number, number, number]
  /** rgb 0..1. */
  colorB: [number, number, number]
  /** 0..1 overall strength. */
  intensity: number
  /** pointer in uv space, 0..1 from top-left. */
  pointer: [number, number]
}

export interface ShaderRunner {
  start(): void
  stop(): void
  destroy(): void
  /** Re-read the canvas size (call on resize). */
  resize(): void
}

/** A catalogue effect: a fragment shader plus the static fallback it degrades to. */
export interface ShaderEffect {
  name: string
  /** WebGL2 `#version 300 es` fragment shader. */
  frag: string
  /** Whether the effect reads `u_pointer` (hover effects track the cursor). */
  usesPointer: boolean
  /**
   * Static CSS for the surface when the live shader can't or shouldn't run
   * (no WebGL2, reduced-motion, or before the runtime lazy-loads). Receives the
   * resolved CSS colours so the fallback matches the live look.
   */
  fallback(colorA: string, colorB: string, intensity: number): Record<string, string>
  /** One-line reason the effect earns its place (docs + review gate). */
  rationale: string
}
