/**
 * FSkeleton — a pulsing placeholder for loading content. Mirrors the web
 * `<f-skeleton>`. Pulses via Reanimated; holds a static dim state under
 * reduce-motion.
 */

import { useEffect } from 'react'
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FSkeletonProps {
  width?: DimensionValue
  height?: number
  /** Corner radius (defaults to the sm token). */
  radius?: number
  style?: StyleProp<ViewStyle>
}

export function FSkeleton({ width = '100%', height = 16, radius, style }: FSkeletonProps) {
  const theme = useFusionTheme()
  const reduced = useReducedMotion()
  const pulse = useSharedValue(0.6)

  useEffect(() => {
    if (reduced) return
    pulse.value = withRepeat(withTiming(1, { duration: 800 }), -1, true)
    return () => cancelAnimation(pulse)
  }, [reduced, pulse])

  const animStyle = useAnimatedStyle(() => ({ opacity: reduced ? 0.55 : pulse.value }))

  return (
    <Animated.View
      accessibilityRole="none"
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor: withAlpha(theme.colors['on-surface'], 0.12),
        },
        animStyle,
        style,
      ]}
    />
  )
}
