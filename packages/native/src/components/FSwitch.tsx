/**
 * FSwitch — the React Native sibling of the web <FSwitch>. Mirrors the contract:
 * value/onValueChange, color, disabled. A token-driven track with a Reanimated
 * spring thumb and an interpolated (off → accent) track color, so it feels like
 * the web toggle.
 */
import { Pressable, StyleSheet } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  ReduceMotion,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { useFusionTheme, useColor } from '../theme'

export interface FSwitchProps {
  value?: boolean
  onValueChange?: (value: boolean) => void
  color?: string
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export function FSwitch({
  value = false,
  onValueChange,
  color = 'primary',
  disabled = false,
  style,
}: FSwitchProps) {
  const theme = useFusionTheme()
  const accent = useColor(color) ?? color
  const off = String(theme.variables['surface-3'] ?? '#e0e4e8')

  // A single 0→1 spring drives the thumb position, the track color, and the
  // accent-tinted thumb glow in the checked state. reduceMotion: System makes it
  // jump instead of spring when the OS "Reduce Motion" setting is on.
  const t = useSharedValue(value ? 1 : 0)
  useEffect(() => {
    t.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 180,
      reduceMotion: ReduceMotion.System,
    })
  }, [value, t])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], [off, accent]),
  }))
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 2 + t.value * 20 }],
    // Web parity: the checked thumb gains a colored elevation glow.
    shadowColor: interpolateColor(t.value, [0, 1], ['#000000', accent]),
    shadowOpacity: 0.2 + t.value * 0.2,
    shadowRadius: 2 + t.value * 4,
  }))

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={[disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: { width: 46, height: 26, borderRadius: 13, justifyContent: 'center' },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  disabled: { opacity: 0.5 },
})
