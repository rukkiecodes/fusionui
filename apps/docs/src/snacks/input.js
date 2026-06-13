import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'

// ----TOKENS START----
const T = {
  colors: {
    primary: '#195bff',
    'on-primary': '#ffffff',
    success: '#46c93a',
    'on-success': '#ffffff',
    danger: '#ff4757',
    'on-danger': '#ffffff',
    warning: '#ffba00',
    'on-warning': '#1e1e1e',
    surface: '#ffffff',
    'on-surface': '#2c3e50',
    background: '#ffffff',
    'surface-2': '#f4f7f8',
    'surface-3': '#e9eef1',
  },
  radius: { sm: 8, md: 12, lg: 20 },
  motion: { fast: 150, base: 250 },
}
const color = c => T.colors[c] || c
const withAlpha = (hex, a) =>
  /^#[0-9a-f]{6}$/i.test(hex)
    ? hex +
      Math.round(a * 255)
        .toString(16)
        .padStart(2, '0')
    : hex
const shadowRest = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 4,
}
// ----TOKENS END----

/**
 * FInput — the React Native sibling of the web <FInput>/<FField>. Same contract:
 * label, placeholder, value/onChangeText, disabled, and an error/message surface.
 * The Vuesax gray fill (surface-2 -> surface-3 on focus) + a 2px border that
 * smoothly colors to the accent on focus (danger on error), with a subtle lift.
 */
function FInput({
  label,
  value,
  onChangeText,
  disabled = false,
  error,
  message,
  color: accentName = 'primary',
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  placeholder,
}) {
  const [focused, setFocused] = useState(false)

  const accent = color(accentName)
  const danger = color('danger')
  const fillRest = color('surface-2')
  const fillFocus = color('surface-3')
  const neutralBorder = color('surface-3')
  const onSurface = color('on-surface')

  // 0 = blurred, 1 = focused. Drives border color + fill + lift via withTiming.
  const focus = useSharedValue(0)

  // Animate the wrapping border view: borderColor crossfades surface-3 -> accent
  // (or stays danger when error), plus a 1px lift and a slightly warmer fill.
  const borderStyle = useAnimatedStyle(() => {
    const borderColor = error
      ? danger
      : interpolateColor(focus.value, [0, 1], [neutralBorder, accent])
    const backgroundColor = interpolateColor(focus.value, [0, 1], [fillRest, fillFocus])
    return {
      borderColor,
      backgroundColor,
      transform: [{ translateY: -focus.value }],
    }
  })

  function handleFocus() {
    setFocused(true)
    focus.value = withTiming(1, { duration: T.motion.base })
  }
  function handleBlur() {
    setFocused(false)
    focus.value = withTiming(0, { duration: T.motion.base })
  }

  const messageColor = error ? danger : withAlpha(onSurface, 0.6)
  const messageText = error || message

  return (
    <View style={[styles.wrap, disabled && styles.wrapDisabled]}>
      {label ? <Text style={[styles.label, { color: onSurface }]}>{label}</Text> : null}

      <Animated.View style={[styles.control, borderStyle, focused && shadowRest]}>
        <TextInput
          editable={!disabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={withAlpha(onSurface, 0.45)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          accessibilityLabel={label}
          style={[styles.input, { color: withAlpha(onSurface, 0.95) }]}
        />
      </Animated.View>

      {messageText ? (
        <Text style={[styles.msg, { color: messageColor }]}>{messageText}</Text>
      ) : (
        <View style={styles.msgSpacer} />
      )}
    </View>
  )
}

export default function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>FInput</Text>
        <Text style={styles.subtitle}>
          Vuesax filled field — the 2px border smoothly colors on focus.
        </Text>

        <Group caption="Labelled + bound (focus to see the accent slide in)">
          <FInput
            label="Full name"
            placeholder="Ada Lovelace"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </Group>

        <Group caption="Helper message">
          <FInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            message="We will never share your email."
          />
        </Group>

        <Group caption="Error state (danger border + message)">
          <FInput
            label="Username"
            placeholder="pick a handle"
            value="ab"
            onChangeText={() => {}}
            error="Must be at least 3 characters."
          />
        </Group>

        <Group caption="Success accent">
          <FInput
            label="Promo code"
            placeholder="FUSION20"
            value="FUSION20"
            onChangeText={() => {}}
            color="success"
            message="Code applied."
          />
        </Group>

        <Group caption="Disabled">
          <FInput label="Account ID" value="usr_8f31c0" onChangeText={() => {}} disabled />
        </Group>

        <Group caption="Password (secureTextEntry)">
          <FInput
            label="Password"
            placeholder="••••••••"
            value={pwd}
            onChangeText={setPwd}
            secureTextEntry
            autoCapitalize="none"
          />
        </Group>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function Group({ caption, children }) {
  return (
    <View style={styles.group}>
      <Text style={styles.caption}>{caption}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color('surface-2') },
  scroll: { padding: 20, paddingTop: 28 },
  title: { fontSize: 30, fontWeight: '700', color: color('on-surface') },
  subtitle: {
    fontSize: 13,
    color: withAlpha(color('on-surface'), 0.6),
    marginTop: 4,
    marginBottom: 20,
  },
  group: { marginBottom: 22 },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: withAlpha(color('on-surface'), 0.5),
    marginBottom: 8,
  },

  wrap: { alignSelf: 'stretch', gap: 6 },
  wrapDisabled: { opacity: 0.5 },
  label: { fontSize: 13, fontWeight: '500' },
  control: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: T.radius.md,
  },
  input: { fontSize: 15, paddingVertical: 8 },
  msg: { fontSize: 12, paddingHorizontal: 4 },
  msgSpacer: { height: 14 },
})
