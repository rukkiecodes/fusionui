/**
 * FButton — the React Native sibling of the web <FBtn>. Same prop names,
 * variants and states (variant/color/size/loading/disabled/block), so a team
 * moving between platforms re-uses its mental model. Token-driven: every value
 * comes from the FusionUI theme, never a literal.
 */
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { useFusionTheme, useColor, shadowStyle } from '../theme'

export type FButtonVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text'
export type FButtonSize = 'small' | 'default' | 'large'

export interface FButtonProps {
  variant?: FButtonVariant
  /** Theme color name (primary, success…) or any RN color string. */
  color?: string
  size?: FButtonSize
  loading?: boolean
  disabled?: boolean
  /** Stretch to fill the parent width. */
  block?: boolean
  prependIcon?: React.ReactNode
  appendIcon?: React.ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
}

const SIZES: Record<FButtonSize, { padV: number; padH: number; font: number; radius: number }> = {
  small: { padV: 6, padH: 12, font: 13, radius: 9 },
  default: { padV: 10, padH: 18, font: 15, radius: 12 },
  large: { padV: 14, padH: 24, font: 17, radius: 15 },
}

export function FButton({
  variant = 'elevated',
  color = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  block = false,
  prependIcon,
  appendIcon,
  onPress,
  style,
  textStyle,
  children,
}: FButtonProps) {
  const theme = useFusionTheme()
  const [pressed, setPressed] = useState(false)
  const base = useColor(color) ?? color
  const onBase = useColor(`on-${color}`) ?? '#ffffff'
  const sz = SIZES[size]

  const { container, label } = useMemo(() => {
    const c: ViewStyle = {
      paddingVertical: sz.padV,
      paddingHorizontal: sz.padH,
      borderRadius: sz.radius,
      alignSelf: block ? 'stretch' : 'flex-start',
    }
    const t: TextStyle = {
      fontSize: sz.font,
      fontWeight: theme.font.weight.medium as TextStyle['fontWeight'],
    }
    switch (variant) {
      case 'elevated':
        c.backgroundColor = base
        Object.assign(c, shadowStyle(theme.shadowRest, 4))
        t.color = onBase
        break
      case 'flat':
        c.backgroundColor = base
        t.color = onBase
        break
      case 'tonal':
        c.backgroundColor = withAlpha(base, 0.14)
        t.color = base
        break
      case 'outlined':
        c.backgroundColor = 'transparent'
        c.borderWidth = 2
        c.borderColor = base
        t.color = base
        break
      case 'text':
        c.backgroundColor = 'transparent'
        t.color = base
        break
    }
    return { container: c, label: t }
  }, [variant, base, onBase, sz, block, theme])

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.base,
        container,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={label.color as string} />
      ) : (
        <View style={styles.row}>
          {prependIcon ? <View style={styles.icon}>{prependIcon}</View> : null}
          {typeof children === 'string' ? (
            <Text style={[label, textStyle]}>{children}</Text>
          ) : (
            children
          )}
          {appendIcon ? <View style={styles.icon}>{appendIcon}</View> : null}
        </View>
      )}
    </Pressable>
  )
}

/** Compose an 8-digit alpha onto a #rrggbb color (tonal fill). */
function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
})
