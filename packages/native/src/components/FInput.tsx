/**
 * FInput — the React Native sibling of the web <FInput>/<FField>. Same contract:
 * label, placeholder, value/onChangeText, disabled, and an error/message surface.
 * The Vuesax gray fill + 2px transparent border that colors on focus.
 */
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native'
import { useFusionTheme, useColor } from '../theme'

export interface FInputProps extends Pick<
  TextInputProps,
  'placeholder' | 'keyboardType' | 'secureTextEntry' | 'autoCapitalize'
> {
  label?: string
  value?: string
  onChangeText?: (text: string) => void
  disabled?: boolean
  /** Error message; also turns the border danger. */
  error?: string
  /** Helper text under the field. */
  message?: string
  /** Focus accent color (theme name or color). */
  color?: string
  style?: StyleProp<ViewStyle>
}

export function FInput({
  label,
  value,
  onChangeText,
  disabled = false,
  error,
  message,
  color = 'primary',
  style,
  ...textProps
}: FInputProps) {
  const theme = useFusionTheme()
  const [focused, setFocused] = useState(false)
  const accent = useColor(color) ?? color
  const danger = useColor('danger') ?? '#ff4757'
  const fill = String(theme.variables['surface-2'] ?? theme.colors.light)
  const borderColor = error ? danger : focused ? accent : 'transparent'

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors['on-surface'] }]}>{label}</Text>
      ) : null}
      <TextInput
        editable={!disabled}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={withAlpha(String(theme.colors['on-surface'] ?? '#2c3e50'), 0.45)}
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        style={[
          styles.input,
          {
            backgroundColor: fill,
            borderColor,
            borderRadius: theme.radius.md,
            color: theme.colors['on-surface'],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        {...textProps}
      />
      {error ? (
        <Text style={[styles.msg, { color: danger }]}>{error}</Text>
      ) : message ? (
        <Text
          style={[
            styles.msg,
            { color: withAlpha(String(theme.colors['on-surface'] ?? '#2c3e50'), 0.6) },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  )
}

function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignSelf: 'stretch' },
  label: { fontSize: 13, fontWeight: '500' },
  input: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, fontSize: 15 },
  msg: { fontSize: 12 },
})
