/**
 * Breakpoint resolver — the native equivalent of the web's responsive class
 * infixes (`sm:`, `md:`…). Off the same `breakpoint` token as the web, so the
 * thresholds match.
 *
 * Pure (no React) so it's unit-testable; the `useBreakpoints` hook that reads
 * `useWindowDimensions` lives in ./hooks.
 */

import { breakpoint } from '@rukkiecodes/tokens/native'

/** { sm, md, lg, xl } widths in dp, from the token source. */
export const BREAKPOINTS = breakpoint as { sm: number; md: number; lg: number; xl: number }

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']

/** The largest breakpoint whose threshold `width` has reached. */
export function resolveBreakpoint(width: number, bp: typeof BREAKPOINTS = BREAKPOINTS): Breakpoint {
  if (width >= bp.xl) return 'xl'
  if (width >= bp.lg) return 'lg'
  if (width >= bp.md) return 'md'
  if (width >= bp.sm) return 'sm'
  return 'xs'
}

/** True when the current breakpoint is `target` or wider. */
export function isBreakpointUp(current: Breakpoint, target: Breakpoint): boolean {
  return BREAKPOINT_ORDER.indexOf(current) >= BREAKPOINT_ORDER.indexOf(target)
}
