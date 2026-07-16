/**
 * FTextarea — a multi-line text field. Mirrors the web `<f-textarea>`:
 * `value`, `label`, `error`, `message`, plus `rows` for the initial height.
 */

import { useState } from 'react'
import { TextInput } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'
import { FField } from './FField'

export interface FTextareaProps {
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  label?: string
  message?: string
  error?: string
  /** Approximate visible rows (initial height). Default 4. */
  rows?: number
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export function FTextarea({
  value,
  onChangeText,
  placeholder,
  label,
  message,
  error,
  rows = 4,
  disabled = false,
  style,
}: FTextareaProps) {
  const theme = useFusionTheme()
  const [focused, setFocused] = useState(false)
  const border = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : withAlpha(theme.colors['on-surface'], 0.14)

  return (
    <FField label={label} message={message} error={error} style={style}>
      <TextInput
        multiline
        editable={!disabled}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={withAlpha(theme.colors['on-surface'], 0.4)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          minHeight: rows * 22 + 20,
          textAlignVertical: 'top',
          padding: 12,
          borderRadius: theme.radius.md,
          borderWidth: 1.5,
          borderColor: border,
          backgroundColor: withAlpha(theme.colors['on-surface'], 0.03),
          color: theme.colors['on-surface'],
          fontSize: 15,
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </FField>
  )
}
