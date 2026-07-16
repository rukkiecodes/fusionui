/**
 * Motion config derived from the shared motion tokens — so mobile timing is the
 * same heartbeat as the web (0.25s base, 0.15s fast) and the signature press
 * behaviour matches.
 *
 * Pure (no React, no Reanimated) so it's unit-testable; the `useMotion` hook and
 * `<FPressable>` that consume it live in ./FPressable.
 */

import type { FusionTheme } from '../theme/tokens'

export interface MotionTokens {
  /** Base transition duration (ms). */
  durationBase: number
  /** Fast/interaction duration (ms). */
  durationFast: number
  /** Hover-lift distance (dp, negative = up). */
  lift: number
  /** Press-sink distance (dp, positive = down). */
  sink: number
}

export function motionTokens(theme: FusionTheme): MotionTokens {
  return {
    durationBase: theme.motion.duration.base,
    durationFast: theme.motion.duration.fast,
    lift: theme.motion.lift,
    sink: theme.motion.sink,
  }
}

export interface PressMotion {
  /** Scale to animate to while pressed. */
  pressedScale: number
  /** translateY (dp) while pressed — the element sinks under the finger. */
  pressedTranslateY: number
  /** Animation duration (ms); 0 under reduced motion. */
  duration: number
}

/**
 * The signature press feel: a small scale-down + sink. Under reduced motion it
 * collapses to no movement (the press is still registered, just not animated).
 */
export function pressMotion(theme: FusionTheme, reduced = false): PressMotion {
  if (reduced) return { pressedScale: 1, pressedTranslateY: 0, duration: 0 }
  return {
    pressedScale: 0.97,
    pressedTranslateY: theme.motion.sink,
    duration: theme.motion.duration.fast,
  }
}
