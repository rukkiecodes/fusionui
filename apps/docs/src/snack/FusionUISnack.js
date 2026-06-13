import React, { useRef, useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
} from 'react-native'

// ─────────────────────────────────────────────────────────────────────────────
// FusionUI — a self-contained, runnable mirror of @fusionui/native.
//
// The published package imports these from @fusionui/native; here they're inlined
// (pure React Native, no extra deps) so this Snack runs live in the browser. The
// VALUES below come straight from @fusionui/tokens — the same design truth the web
// and native libraries share, so what you see here is what ships on a device.
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  colors: {
    primary: '#195bff',
    success: '#46c93a',
    danger: '#ff4757',
    surface: '#ffffff',
    background: '#f4f7f8',
    onSurface: '#2c3e50',
    surface2: '#f4f7f8',
  },
  radius: { sm: 8, md: 12, lg: 20 },
}

const shadowRest = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 3,
}

// FButton — variant / color / size / block, token-driven.
function FButton({ variant = 'elevated', color = 'primary', block, onPress, children }) {
  const [pressed, setPressed] = useState(false)
  const base = tokens.colors[color] || color
  const styles = {
    elevated: { backgroundColor: base, ...shadowRest },
    tonal: { backgroundColor: base + '22' },
    outlined: { backgroundColor: 'transparent', borderWidth: 2, borderColor: base },
    text: { backgroundColor: 'transparent' },
  }[variant]
  const textColor = variant === 'elevated' ? '#fff' : base
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        ui.btn,
        styles,
        block && { alignSelf: 'stretch' },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={{ color: textColor, fontWeight: '500', fontSize: 15 }}>{children}</Text>
    </Pressable>
  )
}

// FCard — the Vuesax soft-shadow surface.
function FCard({ children }) {
  return <View style={ui.card}>{children}</View>
}

// FInput — label + value, Vuesax gray fill, 2px border that colors on focus.
function FInput({ label, value, onChangeText, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={ui.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(44,62,80,0.45)"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[ui.input, { borderColor: focused ? tokens.colors.primary : 'transparent' }]}
      />
    </View>
  )
}

// FSwitch — token-driven animated track + thumb.
function FSwitch({ value, onValueChange, color = 'primary' }) {
  const t = useRef(new Animated.Value(value ? 1 : 0)).current
  useEffect(() => {
    Animated.timing(t, { toValue: value ? 1 : 0, duration: 150, useNativeDriver: false }).start()
  }, [value])
  const trackColor = t.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e4e8', tokens.colors[color]],
  })
  const x = t.interpolate({ inputRange: [0, 1], outputRange: [2, 22] })
  return (
    <Pressable onPress={() => onValueChange(!value)}>
      <Animated.View style={[ui.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[ui.thumb, { transform: [{ translateX: x }] }]} />
      </Animated.View>
    </Pressable>
  )
}

// ─── Demo screen ─────────────────────────────────────────────────────────────
export default function App() {
  const [count, setCount] = useState(0)
  const [on, setOn] = useState(true)
  const [email, setEmail] = useState('')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.surface }}>
      {/* App bar — the FShell navbar (the brighter shell frame) */}
      <View style={ui.bar}>
        <Text style={ui.brand}>FusionUI</Text>
      </View>

      {/* Recessed content that nestles under the bar */}
      <ScrollView
        style={{ backgroundColor: tokens.colors.background }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        <FCard>
          <View style={{ gap: 14 }}>
            <FInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <FButton block color="primary" onPress={() => setCount(c => c + 1)}>
              {`Clicked ${count}×`}
            </FButton>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <FButton variant="tonal" color="success">
                Tonal
              </FButton>
              <FButton variant="outlined" color="danger">
                Outlined
              </FButton>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <FSwitch value={on} onValueChange={setOn} />
              <Text style={{ color: tokens.colors.onSurface }}>Notifications</Text>
            </View>
          </View>
        </FCard>
      </ScrollView>
    </SafeAreaView>
  )
}

const ui = StyleSheet.create({
  bar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: tokens.colors.surface,
  },
  brand: { fontSize: 20, fontWeight: '700', color: tokens.colors.onSurface },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: 16,
    ...shadowRest,
  },
  label: { fontSize: 13, fontWeight: '500', color: tokens.colors.onSurface },
  input: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: tokens.radius.md,
    fontSize: 15,
    color: tokens.colors.onSurface,
    backgroundColor: tokens.colors.surface2,
  },
  track: { width: 46, height: 26, borderRadius: 13, justifyContent: 'center' },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
})
