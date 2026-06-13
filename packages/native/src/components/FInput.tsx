/**
 * FInput — the React Native sibling of the web <FInput>/<FField>. Same contract:
 * label, placeholder, value/onChangeText, disabled, and an error/message surface.
 * The Vuesax gray fill + a 2px border that animates (Reanimated) to the accent on
 * focus — danger when in error — matching the web field's smooth focus.
 */
import { StyleSheet, Text, TextInput, View } from 'react-native'
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  ReduceMotion,
} from 'react-native-reanimated'
import { useFusionTheme, useColor } from '../theme'

export interface FInputProps extends Pick<
  TextInputProps,
  'placeholder' | 'keyboardType' | 'secureTextEntry' | 'autoCapitalize'
> {
  label?: string
  value?: string
  onChangeText?: (text: string) => void
  disabled?: boolean
  /** Error message; also turns the border danger. */
  error?: string
  /** Helper text under the field. */
  message?: string
  /** Focus accent color (theme name or color). */
  color?: string
  style?: StyleProp<ViewStyle>
}

export function FInput({
  label,
  value,
  onChangeText,
  disabled = false,
  error,
  message,
  color = 'primary',
  style,
  ...textProps
}: FInputProps) {
  const theme = useFusionTheme()
  const accent = useColor(color) ?? color
  const danger = useColor('danger') ?? '#ff4757'
  const neutral = String(theme.variables['surface-3'] ?? '#e0e4e8')
  const fill = String(theme.variables['surface-2'] ?? theme.colors.light)

  // 0→1 focus value crossfades the border to the accent (timing, not spring —
  // a spring would overshoot the interpolated color) and lifts the field 2px.
  const f = useSharedValue(0)
  const borderStyle = useAnimatedStyle(() => ({
    borderColor: error ? danger : interpolateColor(f.value, [0, 1], [neutral, accent]),
    transform: [{ translateY: -2 * f.value }],
  }))

  const onFocus = () => {
    f.value = withTiming(1, {
      duration: theme.motion.duration.base,
      reduceMotion: ReduceMotion.System,
    })
  }
  const onBlur = () => {
    f.value = withTiming(0, {
      duration: theme.motion.duration.base,
      reduceMotion: ReduceMotion.System,
    })
  }

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors['on-surface'] }]}>{label}</Text>
      ) : null}
      <Animated.View
        style={[
          styles.border,
          { backgroundColor: fill, borderRadius: theme.radius.md, opacity: disabled ? 0.5 : 1 },
          borderStyle,
        ]}
      >
        <TextInput
          editable={!disabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor={withAlpha(String(theme.colors['on-surface'] ?? '#2c3e50'), 0.45)}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          style={[styles.input, { color: theme.colors['on-surface'] }]}
          {...textProps}
        />
      </Animated.View>
      {error ? (
        <Text style={[styles.msg, { color: danger }]}>{error}</Text>
      ) : message ? (
        <Text
          style={[
            styles.msg,
            { color: withAlpha(String(theme.colors['on-surface'] ?? '#2c3e50'), 0.6) },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  )
}

function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignSelf: 'stretch' },
  label: { fontSize: 13, fontWeight: '500' },
  border: { borderWidth: 2 },
  input: { minHeight: 40, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15 },
  msg: { fontSize: 12 },
})
