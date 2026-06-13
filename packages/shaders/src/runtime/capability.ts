// Capability + preference detection. SSR-safe: every check guards on the DOM.

let webgl2: boolean | null = null

/** True when the browser can create a WebGL2 context (cached after first probe). */
export function supportsWebGL2(): boolean {
  if (webgl2 !== null) return webgl2
  if (typeof document === 'undefined') return (webgl2 = false)
  try {
    const canvas = document.createElement('canvas')
    webgl2 = !!canvas.getContext('webgl2')
  } catch {
    webgl2 = false
  }
  return webgl2
}

/** True when the user asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Should the live shader run at all? It must be a capable browser, motion must
 * be allowed, and we must be in a DOM. Otherwise the surface shows its static
 * CSS fallback.
 */
export function shouldRunShader(): boolean {
  return typeof window !== 'undefined' && supportsWebGL2() && !prefersReducedMotion()
}
