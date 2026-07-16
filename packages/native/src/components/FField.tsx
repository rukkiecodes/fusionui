/**
 * FField — a form-field wrapper: label, control (children), and a help/error
 * message. Mirrors the web `<f-field>` — the shared shell every input sits in.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FFieldProps {
  label?: string
  /** Help text under the control. */
  message?: string
  /** Error text — shown in the danger colour, overrides `message`. */
  error?: string
  required?: boolean
  /** The control (input, select…). */
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function FField({ label, message, error, required = false, children, style }: FFieldProps) {
  const theme = useFusionTheme()
  const shown = error ?? message
  const shownColor = error ? theme.colors.danger : withAlpha(theme.colors['on-surface'], 0.6)

  return (
    <View style={[{ gap: 6 }, style]}>
      {label != null ? (
        <Text style={{ color: theme.colors['on-surface'], fontSize: 14, fontWeight: '600' }}>
          {label}
          {required ? <Text style={{ color: theme.colors.danger }}> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {shown != null ? <Text style={{ color: shownColor, fontSize: 12.5 }}>{shown}</Text> : null}
    </View>
  )
}
