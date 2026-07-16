/**
 * FAvatar — a rounded-square tile holding a photo or initials. Mirrors the web
 * `<f-avatar>`: `image`, `text` (→ initials fallback), `color`, `size`.
 */

import { Image, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { initials } from './helpers'

export interface FAvatarProps {
  /** Photo URI. Falls back to initials (from `text`) when absent. */
  image?: string
  /** Name — its initials show when there's no image. */
  text?: string
  /** Background colour for the initials tile (theme name or raw colour). */
  color?: string
  /** Edge length in dp (default 44). */
  size?: number
  /** Fully round instead of a rounded square. */
  circle?: boolean
  style?: StyleProp<ViewStyle>
}

export function FAvatar({
  image,
  text,
  color = 'primary',
  size = 44,
  circle = false,
  style,
}: FAvatarProps) {
  const theme = useFusionTheme()
  const radius = circle ? size / 2 : theme.radius.md
  const base: ViewStyle = { width: size, height: size, borderRadius: radius, overflow: 'hidden' }

  if (image) {
    // Image goes inside a clipping View so the outer style stays ViewStyle.
    return (
      <View style={[base, style]}>
        <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
      </View>
    )
  }

  const bg = theme.colors[color] ?? color
  const fg = theme.colors[`on-${color}`] ?? '#ffffff'
  return (
    <View
      style={[base, { backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Text style={{ color: fg, fontSize: size * 0.38, fontWeight: '700' }}>{initials(text)}</Text>
    </View>
  )
}
