/**
 * `useMotion` + `<FPressable>` — the signature press feel.
 *
 * Imports react-native-reanimated, so it's separate from the pure motion config
 * in ./motion (which the tests import). Reduced motion is folded in: the press
 * is always registered, but under reduce-motion it doesn't move.
 */

import { forwardRef, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Pressable } from 'react-native'
import type {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useFusionTheme } from '../theme'
import { motionTokens, pressMotion } from './motion'
import type { MotionTokens, PressMotion } from './motion'

export interface Motion extends MotionTokens {
  /** Whether the OS has reduce-motion enabled. */
  reduced: boolean
  /** The resolved press targets (already reduce-motion-aware). */
  press: PressMotion
}

/** Motion tokens + reduce-motion state + the resolved press targets. */
export function useMotion(): Motion {
  const theme = useFusionTheme()
  const reduced = useReducedMotion()
  return useMemo(
    () => ({ ...motionTokens(theme), reduced, press: pressMotion(theme, reduced) }),
    [theme, reduced]
  )
}

export interface FPressableProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>
  children?: ReactNode
  /** Turn off the press-sink animation (touch handling is unaffected). */
  animate?: boolean
}

/**
 * A Pressable that sinks and scales down slightly on press — the signature
 * FusionUI touch feel, driven by Reanimated off the motion tokens.
 */
export const FPressable = forwardRef<View, FPressableProps>(function FPressable(
  { style, animate = true, children, onPressIn, onPressOut, ...rest },
  ref
) {
  const { press } = useMotion()
  const pressed = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(1 - pressed.value * (1 - press.pressedScale), {
          duration: press.duration,
        }),
      },
      {
        translateY: withTiming(pressed.value * press.pressedTranslateY, {
          duration: press.duration,
        }),
      },
    ],
  }))

  return (
    <Pressable
      ref={ref}
      onPressIn={(e: GestureResponderEvent) => {
        if (animate) pressed.value = 1
        onPressIn?.(e)
      }}
      onPressOut={(e: GestureResponderEvent) => {
        pressed.value = 0
        onPressOut?.(e)
      }}
      {...rest}
    >
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </Pressable>
  )
})
