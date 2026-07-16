/**
 * FFeature — an icon + title + body block for feature grids. Mirrors the web
 * `<f-feature>`.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FFeatureProps {
  icon?: ReactNode
  title?: string
  text?: string
  style?: StyleProp<ViewStyle>
}

export function FFeature({ icon, title, text, style }: FFeatureProps) {
  const theme = useFusionTheme()
  return (
    <View style={[{ gap: 8 }, style]}>
      {icon != null ? (
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: withAlpha(theme.colors.primary, 0.1),
          }}
        >
          {icon}
        </View>
      ) : null}
      {title != null ? (
        <Text style={{ color: theme.colors['on-surface'], fontSize: 17, fontWeight: '700' }}>
          {title}
        </Text>
      ) : null}
      {text != null ? (
        <Text
          style={{ color: theme.colors['on-surface'], opacity: 0.65, fontSize: 14, lineHeight: 21 }}
        >
          {text}
        </Text>
      ) : null}
    </View>
  )
}
