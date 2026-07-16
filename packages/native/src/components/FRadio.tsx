/**
 * FRadio + FRadioGroup — single-choice selection. Mirrors the web
 * `<f-radio-group>`: bind `value`, pass `options`, and the group emits the
 * selected value. FRadio draws one dot-in-ring control.
 */

import { Pressable, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FRadioProps {
  selected?: boolean
  onPress?: () => void
  color?: string
  disabled?: boolean
  label?: string
  size?: number
  style?: StyleProp<ViewStyle>
}

export function FRadio({
  selected = false,
  onPress,
  color = 'primary',
  disabled = false,
  label,
  size = 22,
  style,
}: FRadioProps) {
  const theme = useFusionTheme()
  const c = theme.colors[color] ?? color
  const border = withAlpha(theme.colors['on-surface'], 0.3)

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: selected ? c : border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{
              width: size * 0.5,
              height: size * 0.5,
              borderRadius: size * 0.25,
              backgroundColor: c,
            }}
          />
        ) : null}
      </View>
      {label != null ? (
        <Text style={{ color: theme.colors['on-surface'], fontSize: 15 }}>{label}</Text>
      ) : null}
    </Pressable>
  )
}

export interface FRadioOption {
  label: string
  value: string
}

export interface FRadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  options: FRadioOption[]
  color?: string
  disabled?: boolean
  /** Gap between options in dp. */
  gap?: number
  style?: StyleProp<ViewStyle>
}

export function FRadioGroup({
  value,
  onValueChange,
  options,
  color,
  disabled,
  gap = 12,
  style,
}: FRadioGroupProps) {
  return (
    <View accessibilityRole="radiogroup" style={[{ gap }, style]}>
      {options.map(o => (
        <FRadio
          key={o.value}
          label={o.label}
          color={color}
          disabled={disabled}
          selected={value === o.value}
          onPress={() => onValueChange?.(o.value)}
        />
      ))}
    </View>
  )
}
