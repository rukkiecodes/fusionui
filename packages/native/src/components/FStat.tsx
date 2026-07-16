/**
 * FStat — a headline metric with a label and optional icon. Mirrors the web
 * `<f-stat>`.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'

export interface FStatProps {
  value: string | number
  label?: string
  icon?: ReactNode
  /** Theme colour name (default primary) or any RN colour for the value. */
  color?: string
  style?: StyleProp<ViewStyle>
}

export function FStat({ value, label, icon, color = 'primary', style }: FStatProps) {
  const theme = useFusionTheme()
  const c = theme.colors[color] ?? color
  return (
    <View style={[{ gap: 3 }, style]}>
      {icon}
      <Text style={{ color: c, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>
        {value}
      </Text>
      {label != null ? (
        <Text style={{ color: theme.colors['on-surface'], opacity: 0.6, fontSize: 13 }}>
          {label}
        </Text>
      ) : null}
    </View>
  )
}
