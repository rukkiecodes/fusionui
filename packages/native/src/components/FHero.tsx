/**
 * FHero — an eyebrow + title + subtitle intro block with an action slot.
 * Mirrors the web `<f-hero>`.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'

export interface FHeroProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  /** Action(s) below the copy — typically FButtons. */
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function FHero({ eyebrow, title, subtitle, children, style }: FHeroProps) {
  const theme = useFusionTheme()
  return (
    <View style={[{ gap: 10, paddingVertical: 12 }, style]}>
      {eyebrow != null ? (
        <Text
          style={{
            color: theme.colors.primary,
            fontFamily: theme.font.family.mono,
            fontSize: 12,
            letterSpacing: 1,
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      {title != null ? (
        <Text
          style={{
            color: theme.colors['on-background'],
            fontSize: 32,
            fontWeight: '800',
            letterSpacing: -1,
            lineHeight: 36,
          }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle != null ? (
        <Text
          style={{
            color: theme.colors['on-background'],
            opacity: 0.66,
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  )
}
