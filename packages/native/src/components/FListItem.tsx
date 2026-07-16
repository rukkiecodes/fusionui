/**
 * FListItem — a row with leading/trailing slots and a title/subtitle. Mirrors
 * the web list item. When `onPress` is set it uses `FPressable` for the
 * signature press feel and gets a button role.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { FPressable } from '../styles/FPressable'

export interface FListItemProps {
  title?: string
  subtitle?: string
  leading?: ReactNode
  trailing?: ReactNode
  onPress?: () => void
  disabled?: boolean
  /** Custom content, replacing the title/subtitle block. */
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function FListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  disabled = false,
  children,
  style,
}: FListItemProps) {
  const theme = useFusionTheme()

  const body = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingVertical: 12,
          paddingHorizontal: 16,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {leading}
      <View style={{ flex: 1 }}>
        {children ?? (
          <>
            {title != null ? (
              <Text style={{ color: theme.colors['on-surface'], fontSize: 16, fontWeight: '600' }}>
                {title}
              </Text>
            ) : null}
            {subtitle != null ? (
              <Text
                style={{
                  color: theme.colors['on-surface'],
                  opacity: 0.6,
                  fontSize: 13.5,
                  marginTop: 2,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </>
        )}
      </View>
      {trailing}
    </View>
  )

  if (onPress && !disabled) {
    return (
      <FPressable onPress={onPress} accessibilityRole="button">
        {body}
      </FPressable>
    )
  }
  return body
}
