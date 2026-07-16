/**
 * FOtp — a one-time-code field. Mirrors the web `<f-otp>`: a row of cells backed
 * by one hidden input, digits-only, capped at `length`.
 */

import { useRef } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'
import { otpCells, sanitizeOtp } from './helpers'

export interface FOtpProps {
  value?: string
  onChangeText?: (value: string) => void
  /** Number of cells (default 6). */
  length?: number
  /** Theme colour name for the active cell (default primary). */
  color?: string
  style?: StyleProp<ViewStyle>
}

export function FOtp({
  value = '',
  onChangeText,
  length = 6,
  color = 'primary',
  style,
}: FOtpProps) {
  const theme = useFusionTheme()
  const c = theme.colors[color] ?? color
  const border = withAlpha(theme.colors['on-surface'], 0.14)
  const inputRef = useRef<TextInput>(null)
  const { chars, activeIndex } = otpCells(value, length)

  return (
    <View style={style}>
      <Pressable onPress={() => inputRef.current?.focus()} style={{ flexDirection: 'row', gap: 8 }}>
        {chars.map((ch, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              aspectRatio: 1,
              maxWidth: 52,
              borderRadius: theme.radius.md,
              borderWidth: 1.5,
              borderColor: i === activeIndex && value.length < length ? c : border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors['on-surface'] }}>
              {ch}
            </Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={t => onChangeText?.(sanitizeOtp(t, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
    </View>
  )
}
