/**
 * FCard — the React Native sibling of the web <FCard>. The Vuesax soft-shadow
 * surface: rounded (20px lg radius), themed surface fill, optional resting
 * elevation. When given an `onPress` it becomes interactive and lifts with a
 * Reanimated spring — the web card's hover lift. Token-driven.
 */
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from 'react-native-reanimated'
import { useFusionTheme, shadowStyle } from '../theme'

export interface FCardProps {
  /** Drop the resting shadow (e.g. a flat list item). */
  flat?: boolean
  /** Padding inside the card (token space scale key or px). */
  padding?: number
  /** Corner radius override (defaults to the lg token, 20). */
  radius?: number
  /** Makes the card interactive — and gives it the spring press-lift. */
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

export function FCard({ flat = false, padding, radius, onPress, style, children }: FCardProps) {
  const theme = useFusionTheme()

  const lift = useSharedValue(0)
  const liftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * lift.value }, { scale: 1 + 0.01 * lift.value }],
  }))

  const surface: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: radius ?? theme.radius.lg,
    padding: padding ?? theme.space['4'],
  }
  const elevation = !flat ? shadowStyle(theme.shadowRest, 3) : null
  const body = [styles.base, surface, elevation, style]

  if (!onPress) {
    return <View style={body}>{children}</View>
  }

  return (
    <Animated.View style={liftStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() =>
          (lift.value = withSpring(1, {
            damping: 16,
            stiffness: 200,
            reduceMotion: ReduceMotion.System,
          }))
        }
        onPressOut={() =>
          (lift.value = withSpring(0, {
            damping: 16,
            stiffness: 200,
            reduceMotion: ReduceMotion.System,
          }))
        }
        style={body}
      >
        {children}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  base: { overflow: 'visible' },
})
