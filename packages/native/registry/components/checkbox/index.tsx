/**
 * Checkbox — FusionUI mobile checkbox, mirroring the web FCheckbox: a box that
 * fills with the accent colour while the check mark draws itself on, plus an
 * indeterminate dash, a custom icon slot, line-through labels, a loading ring
 * and array models for checkbox groups.
 * Copy-in source: you own this file after `fusionui add checkbox`.
 *
 * The draw-on mark is adapted from reacticx (MIT © rit3zh) —
 * https://github.com/rit3zh/reacticx
 */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Text, Pressable, AccessibilityInfo, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'
import { PALETTE, SIZES, TICK, DASH, DURATION, RADIUS } from './const'
import type { CheckboxProps } from './types'

const AnimatedPath = Animated.createAnimatedComponent(Path)

// Web uses cubic-bezier(0.4, 0, 0.2, 1) on the way in and a flatter curve out.
const EASE_IN = Easing.bezier(0.4, 0, 0.2, 1)
const EASE_OUT = Easing.bezier(0.4, 0, 0.6, 1)

const CheckboxComponent: React.FC<CheckboxProps> = ({
  value = false,
  itemValue,
  onChange,
  label,
  icon,
  color,
  size = 'md',
  indeterminate = false,
  lineThrough = false,
  loading = false,
  disabled = false,
  style,
  labelStyle,
}) => {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    let alive = true
    AccessibilityInfo.isReduceMotionEnabled().then(on => {
      if (alive) setReduceMotion(on)
    })
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion)
    return () => {
      alive = false
      sub.remove()
    }
  }, [])

  const accent = color ?? PALETTE.primary
  const dims = SIZES[size]
  const inactive = disabled || loading

  const checked = useMemo(
    () => (Array.isArray(value) ? value.includes(itemValue) : !!value),
    [value, itemValue]
  )
  // The box reads as "on" for both checked and indeterminate, but a loading box
  // keeps the accent on its border only (web: transparent fill while spinning).
  const filled = (checked || indeterminate) && !loading

  const mark = useSharedValue(checked || indeterminate ? 1 : 0)
  const box = useSharedValue(filled ? 1 : 0)
  const spin = useSharedValue(0)

  useEffect(() => {
    const on = checked || indeterminate
    const duration = reduceMotion ? 0 : on ? DURATION.mark : DURATION.mark - 50
    mark.value = withTiming(on ? 1 : 0, { duration, easing: on ? EASE_IN : EASE_OUT })
  }, [checked, indeterminate, reduceMotion, mark])

  useEffect(() => {
    box.value = withTiming(filled ? 1 : 0, {
      duration: reduceMotion ? 0 : DURATION.box,
      easing: filled ? EASE_IN : EASE_OUT,
    })
  }, [filled, reduceMotion, box])

  useEffect(() => {
    if (loading && !reduceMotion) {
      spin.value = 0
      spin.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.linear }), -1, false)
    } else {
      spin.value = 0
    }
  }, [loading, reduceMotion, spin])

  const toggle = useCallback(() => {
    if (inactive) return
    if (Array.isArray(value)) {
      const next = [...value]
      const index = next.indexOf(itemValue)
      if (index > -1) next.splice(index, 1)
      else next.push(itemValue)
      onChange?.(next)
    } else {
      onChange?.(!value)
    }
  }, [inactive, value, itemValue, onChange])

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(box.value, [0, 1], ['transparent', accent]),
    borderColor: loading ? accent : interpolateColor(box.value, [0, 1], [PALETTE.border, accent]),
    // Web pairs the fill with a soft drop glow in the accent colour.
    shadowColor: accent,
    shadowOpacity: interpolate(box.value, [0, 1], [0, 0.45]),
    shadowRadius: interpolate(box.value, [0, 1], [0, 8]),
    shadowOffset: { width: 0, height: interpolate(box.value, [0, 1], [0, 4]) },
    elevation: interpolate(box.value, [0, 1], [0, 4]),
  }))

  // Sweep the dash offset from "fully hidden" to "fully drawn".
  const path = indeterminate ? DASH : TICK
  const markProps = useAnimatedProps(() => ({
    strokeDashoffset: path.length - path.length * mark.value,
  }))

  const iconStyle = useAnimatedStyle(() => ({
    opacity: mark.value,
    transform: [{ scale: interpolate(mark.value, [0, 1], [0.4, 1]) }],
  }))

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }))

  const labelActive = checked && lineThrough

  return (
    <Pressable
      onPress={toggle}
      disabled={inactive}
      hitSlop={12}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled: inactive }}
      style={[styles.row, inactive && styles.inactive, style]}
    >
      <Animated.View
        style={[
          styles.box,
          { width: dims.box, height: dims.box, borderWidth: dims.border, borderRadius: RADIUS },
          boxStyle,
        ]}
      >
        {loading ? (
          <Animated.View
            style={[
              styles.spinner,
              {
                width: dims.box * 0.6,
                height: dims.box * 0.6,
                borderRadius: dims.box * 0.3,
                borderColor: accent,
              },
              spinnerStyle,
            ]}
          />
        ) : icon ? (
          <Animated.View style={iconStyle}>{icon}</Animated.View>
        ) : (
          <Svg width={dims.box * 0.8} height={dims.box * 0.8} viewBox="0 0 24 24">
            <AnimatedPath
              d={path.d}
              stroke={PALETTE.onAccent}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={path.length}
              animatedProps={markProps}
            />
          </Svg>
        )}
      </Animated.View>

      {label ? (
        <Text
          style={[
            styles.label,
            { fontSize: dims.font },
            labelActive && styles.lineThrough,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  )
}

export const Checkbox = memo(CheckboxComponent)
export default Checkbox

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  inactive: { opacity: 0.5 },
  box: { alignItems: 'center', justifyContent: 'center' },
  spinner: { borderWidth: 2, borderTopColor: 'transparent' },
  label: { color: PALETTE.label, fontWeight: '500' },
  lineThrough: { textDecorationLine: 'line-through', opacity: 0.55 },
})
