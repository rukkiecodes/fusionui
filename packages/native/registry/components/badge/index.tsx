/**
 * Badge — a compact status / label chip. Colour variants (default, success,
 * warning, error, pending, notifications), three sizes, a full radius scale, and
 * an optional leading icon. Copy-in source: you own this file after `fusionui add badge`.
 *
 * Adapted from reacticx (MIT © rit3zh) — https://github.com/rit3zh/reacticx
 */
import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { variantStyles, sizeStyles, borderRadiusStyles } from './conf'
import type { BadgeProps } from './types'

export const Badge: React.FC<BadgeProps> = memo<BadgeProps>(
  ({ label, variant = 'default', size = 'md', style, textStyle, icon, radius = 'pill' }) => {
    const vs = variantStyles[variant]
    const ss = sizeStyles[size]
    const rs = borderRadiusStyles[radius]

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: vs.backgroundColor,
            paddingVertical: ss.paddingVertical,
            paddingHorizontal: ss.paddingHorizontal,
            borderRadius: rs,
            borderColor: vs.borderColor,
            borderWidth: vs.borderWidth,
          },
          style,
        ]}
      >
        {icon}
        {label ? (
          <Text
            style={[
              styles.text,
              { color: vs.textColor, fontSize: ss.fontSize, marginLeft: icon ? 5 : 0 },
              textStyle,
            ]}
          >
            {label}
          </Text>
        ) : null}
      </View>
    )
  }
)

export default Badge

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: { fontWeight: '600', letterSpacing: 0.2 },
})
