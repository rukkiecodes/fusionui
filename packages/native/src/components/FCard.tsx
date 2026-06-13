/**
 * FCard — the React Native sibling of the web <FCard>. The Vuesax soft-shadow
 * surface: rounded (20px lg radius), themed surface fill, optional resting
 * elevation. Token-driven.
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme, shadowStyle } from '../theme'

export interface FCardProps {
  /** Drop the resting shadow (e.g. a flat list item). */
  flat?: boolean
  /** Padding inside the card (token space scale key or px). */
  padding?: number
  /** Corner radius override (defaults to the lg token, 20). */
  radius?: number
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

export function FCard({ flat = false, padding, radius, style, children }: FCardProps) {
  const theme = useFusionTheme()
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: radius ?? theme.radius.lg,
          padding: padding ?? theme.space['4'],
        },
        !flat && shadowStyle(theme.shadowRest, 3),
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: { overflow: 'visible' },
})
