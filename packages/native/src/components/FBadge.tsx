/**
 * FBadge — a small count/dot marker. Mirrors the web `<f-badge>`: wrap an
 * element to pin the badge to its top-right corner, or render it inline with no
 * children. Numbers above `max` render as `max+`.
 */

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { badgeLabel } from './helpers'

export interface FBadgeProps {
  /** Count or short label. Omit with `dot` for a plain dot. */
  content?: string | number
  /** Theme colour name (defaults to danger) or any RN colour. */
  color?: string
  /** Render a plain dot instead of a labelled badge. */
  dot?: boolean
  /** Cap for numeric content (default 99 → "99+"). */
  max?: number
  /** The element the badge attaches to; omit to render the badge inline. */
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export function FBadge({
  content,
  color = 'danger',
  dot = false,
  max = 99,
  children,
  style,
}: FBadgeProps) {
  const theme = useFusionTheme()
  const bg = theme.colors[color] ?? color
  const fg = theme.colors[`on-${color}`] ?? '#ffffff'
  const label = badgeLabel(content, max)

  const badge = dot ? (
    <View
      style={[
        { width: 10, height: 10, borderRadius: 5, backgroundColor: bg },
        children ? pinned : undefined,
        style,
      ]}
    />
  ) : (
    <View
      style={[
        {
          minWidth: 18,
          height: 18,
          paddingHorizontal: 5,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
        },
        children ? pinned : undefined,
        style,
      ]}
    >
      <Text style={{ color: fg, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  )

  if (!children) return badge
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      {children}
      {badge}
    </View>
  )
}

const pinned: ViewStyle = { position: 'absolute', top: -6, right: -6 }
