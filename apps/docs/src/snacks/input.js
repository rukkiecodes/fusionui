import React, { useState, useRef, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'

// FusionUI design tokens — the exact values @fusionui/tokens ships to native.
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
    'surface-3': '#f0f3f4',
  },
  radius: { sm: 8, md: 12, lg: 20 },
  space: { s1: 4, s2: 8, s3: 12, s4: 16, s5: 24 },
  motion: { fast: 150 },
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
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 3,
}

// FInput — RN sibling of the web <FInput>/<FField>. Vuesax gray fill + a 2px
// transparent border that colors to the accent on focus, danger on error.
function FInput({
  label,
  value,
  onChangeText,
  disabled = false,
  error,
  message,
  color: accentName = 'primary',
  style,
  ...textProps
}) {
  const [focused, setFocused] = useState(false)
  const accent = color(accentName)
  const danger = color('danger')
  const fill = color('surface-2')
  const onSurface = color('on-surface')
  const borderColor = error ? danger : focused ? accent : 'transparent'

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={[styles.label, { color: onSurface }]}>{label}</Text> : null}
      <TextInput
        editable={!disabled}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={withAlpha(onSurface, 0.45)}
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        style={[
          styles.input,
          {
            backgroundColor: fill,
            borderColor,
            borderRadius: T.radius.md,
            color: onSurface,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        {...textProps}
      />
      {error ? (
        <Text style={[styles.msg, { color: danger }]}>{error}</Text>
      ) : message ? (
        <Text style={[styles.msg, { color: withAlpha(onSurface, 0.6) }]}>{message}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignSelf: 'stretch' },
  label: { fontSize: 13, fontWeight: '500' },
  input: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    fontSize: 15,
  },
  msg: { fontSize: 12 },
})

export default function App() {
  const [name, setName] = useState('Ada Lovelace')
  const [email, setEmail] = useState('')
  const [bad, setBad] = useState('not-an-email')
  const [pass, setPass] = useState('hunter2')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.colors['surface-2'] }}>
      <ScrollView contentContainerStyle={demo.page}>
        <Text style={demo.h1}>FInput</Text>

        <View style={demo.group}>
          <Text style={demo.cap}>Labelled · bound to state</Text>
          <FInput
            label="Full name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Helper message · focus colors the border</Text>
          <FInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            message="We'll never share your address."
          />
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Error state · red border + error text</Text>
          <FInput
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            value={bad}
            onChangeText={setBad}
            error="Please enter a valid email address."
          />
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Disabled</Text>
          <FInput
            label="Account ID"
            value="acc_8f3c91b2"
            disabled
            message="Assigned automatically — cannot be changed."
          />
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Password · secureTextEntry</Text>
          <FInput
            label="Password"
            placeholder="Enter a password"
            secureTextEntry
            autoCapitalize="none"
            value={pass}
            onChangeText={setPass}
            message="At least 8 characters."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const demo = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
  h1: { fontSize: 22, fontWeight: '700', color: T.colors['on-surface'] },
  group: { gap: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' },
  cap: { fontSize: 12, fontWeight: '600', color: withAlpha(T.colors['on-surface'], 0.55) },
})
