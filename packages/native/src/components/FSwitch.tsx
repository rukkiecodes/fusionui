/**
 * FSwitch — the React Native sibling of the web <FSwitch>. Mirrors the contract:
 * value/onValueChange, color, disabled. A token-driven track + animated thumb.
 */
import { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
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
  const t = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(t, {
      toValue: value ? 1 : 0,
      duration: theme.motion.duration.fast,
      useNativeDriver: false,
    }).start()
  }, [value, t, theme.motion.duration.fast])

  const trackColor = t.interpolate({ inputRange: [0, 1], outputRange: [off, accent] })
  const thumbX = t.interpolate({ inputRange: [0, 1], outputRange: [2, 22] })

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={[disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
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
