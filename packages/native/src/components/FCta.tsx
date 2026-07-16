/**
 * FCta — a centred call-to-action panel (title, text, and an action slot).
 * Mirrors the web `<f-cta>`. Pass the button(s) as children.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FCtaProps {
  title?: string
  text?: string
  /** The action(s) — typically an FButton. */
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function FCta({ title, text, children, style }: FCtaProps) {
  const theme = useFusionTheme()
  return (
    <View
      style={[
        {
          padding: 24,
          borderRadius: theme.radius.xl,
          backgroundColor: withAlpha(theme.colors.primary, 0.06),
          gap: 12,
          alignItems: 'center',
        },
        style,
      ]}
    >
      {title != null ? (
        <Text
          style={{
            color: theme.colors['on-surface'],
            fontSize: 20,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      ) : null}
      {text != null ? (
        <Text
          style={{
            color: theme.colors['on-surface'],
            opacity: 0.65,
            fontSize: 14,
            lineHeight: 21,
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      ) : null}
      {children}
    </View>
  )
}
