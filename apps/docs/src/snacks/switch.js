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

// FSwitch — native sibling of web <FSwitch>. Token-driven track + animated thumb.
// Mirrors the real contract: value / onValueChange, color, disabled.
function FSwitch({
  value = false,
  onValueChange,
  color: tone = 'primary',
  disabled = false,
  style,
}) {
  const accent = color(tone)
  const off = color('surface-3') // resting track color
  const t = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(t, {
      toValue: value ? 1 : 0,
      duration: T.motion.fast,
      useNativeDriver: false,
    }).start()
  }, [value, t])

  const trackColor = t.interpolate({ inputRange: [0, 1], outputRange: [off, accent] })
  const thumbX = t.interpolate({ inputRange: [0, 1], outputRange: [2, 22] })

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
      style={[disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: { width: 46, height: 26, borderRadius: 13, justifyContent: 'center' },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color('surface'),
    ...shadowRest,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  disabled: { opacity: 0.5 },
})

// A label row: switch on the left, caption text on the right.
function Row({ value, onValueChange, color: tone, disabled, label }) {
  return (
    <Pressable
      style={demo.row}
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
    >
      <FSwitch value={value} onValueChange={onValueChange} color={tone} disabled={disabled} />
      <Text style={demo.label}>{label}</Text>
    </Pressable>
  )
}

export default function App() {
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(false)
  const [sync, setSync] = useState(true)
  const [alerts, setAlerts] = useState(true)
  const [danger, setDanger] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.colors['surface-2'] }}>
      <ScrollView contentContainerStyle={demo.page}>
        <Text style={demo.h1}>FSwitch</Text>

        <View style={demo.group}>
          <Text style={demo.cap}>On / off bound to state</Text>
          <Row value={wifi} onValueChange={setWifi} label={wifi ? 'Wi-Fi on' : 'Wi-Fi off'} />
          <Row
            value={bluetooth}
            onValueChange={setBluetooth}
            label={bluetooth ? 'Bluetooth on' : 'Bluetooth off'}
          />
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Colors</Text>
          <Row value={sync} onValueChange={setSync} color="primary" label="primary" />
          <Row value={alerts} onValueChange={setAlerts} color="success" label="success" />
          <Row value={danger} onValueChange={setDanger} color="danger" label="danger" />
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Disabled</Text>
          <Row value={true} disabled label="disabled (on)" />
          <Row value={false} disabled label="disabled (off)" />
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
  label: { fontSize: 14, fontWeight: '500', color: T.colors['on-surface'] },
})
