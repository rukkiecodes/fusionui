/**
 * FChip — a compact label pill. Mirrors the web `<f-chip>`: `color`, `variant`,
 * `size`. Defaults to the tonal variant (tinted background, coloured text).
 */

import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { resolveVariant } from '../styles/variant'
import type { Variant } from '../styles/variant'
import { chipMetrics } from './helpers'
import type { ChipSize } from './helpers'

export interface FChipProps {
  /** Theme colour name (primary, success…) or any RN colour. */
  color?: string
  variant?: Variant
  size?: ChipSize
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}

export function FChip({
  color = 'primary',
  variant = 'tonal',
  size = 'medium',
  onPress,
  style,
  children,
}: FChipProps) {
  const theme = useFusionTheme()
  const v = resolveVariant(theme, { variant, color })
  const m = chipMetrics(size)

  const body = (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: m.paddingVertical,
          paddingHorizontal: m.paddingHorizontal,
          borderRadius: theme.radius.pill,
          backgroundColor: v.backgroundColor,
          borderColor: v.borderColor,
          borderWidth: v.borderWidth,
        },
        style,
      ]}
    >
      <Text style={{ color: v.color, fontSize: m.fontSize, fontWeight: '600' }}>{children}</Text>
    </View>
  )

  return onPress ? <Pressable onPress={onPress}>{body}</Pressable> : body
}
