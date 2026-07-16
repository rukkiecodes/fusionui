/**
 * FCheckbox — a boolean toggle with a drawn check and an optional label.
 * Mirrors the web `<f-checkbox>`: `value`, `color`, `disabled`.
 */

import { Pressable, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FCheckboxProps {
  value?: boolean
  onValueChange?: (value: boolean) => void
  /** Theme colour name (default primary) or any RN colour. */
  color?: string
  disabled?: boolean
  label?: string
  /** Box edge length in dp (default 22). */
  size?: number
  style?: StyleProp<ViewStyle>
}

export function FCheckbox({
  value = false,
  onValueChange,
  color = 'primary',
  disabled = false,
  label,
  size = 22,
  style,
}: FCheckboxProps) {
  const theme = useFusionTheme()
  const c = theme.colors[color] ?? color
  const on = theme.colors[`on-${color}`] ?? '#ffffff'
  const border = withAlpha(theme.colors['on-surface'], 0.3)

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: value ? c : 'transparent',
          borderWidth: value ? 0 : 2,
          borderColor: border,
        }}
      >
        {value ? (
          <Text style={{ color: on, fontSize: size * 0.62, fontWeight: '900', lineHeight: size }}>
            ✓
          </Text>
        ) : null}
      </View>
      {label != null ? (
        <Text style={{ color: theme.colors['on-surface'], fontSize: 15 }}>{label}</Text>
      ) : null}
    </Pressable>
  )
}
