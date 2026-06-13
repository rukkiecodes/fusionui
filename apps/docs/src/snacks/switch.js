import React, { useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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

// FSwitch — RN sibling of the web <FSwitch>. Mirrors the contract:
// value / onValueChange, color, disabled. Token-driven track + springy thumb.
const SPRING = { damping: 16, stiffness: 220, mass: 0.7 }

function FSwitch({ value = false, onValueChange, color: c = 'primary', disabled = false }) {
  const accent = color(c)
  const off = color('surface-3')

  // Shared value follows the boolean via withSpring (0 = off, 1 = on).
  const v = useSharedValue(value ? 1 : 0)
  React.useEffect(() => {
    v.value = withSpring(value ? 1 : 0, SPRING)
  }, [value])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], [off, accent]),
  }))

  // Thumb translates [2,22]; a touch of overshoot from the spring reads as bounce.
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 2 + v.value * 20 }],
  }))

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
      style={disabled ? styles.disabled : null}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  )
}

function Row({ label, caption, value, onValueChange, color: c, disabled }) {
  return (
    <Pressable onPress={() => !disabled && onValueChange(!value)} style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {caption ? <Text style={styles.rowCaption}>{caption}</Text> : null}
      </View>
      <FSwitch value={value} onValueChange={onValueChange} color={c} disabled={disabled} />
    </Pressable>
  )
}

export default function App() {
  const [bound, setBound] = useState(true)
  const [pri, setPri] = useState(true)
  const [suc, setSuc] = useState(true)
  const [dan, setDan] = useState(false)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>FSwitch</Text>
        <Text style={styles.sub}>
          Springy token-driven toggle — the React Native sibling of the web component.
        </Text>

        <View style={styles.card}>
          <Text style={styles.section}>Bound state</Text>
          <Row
            label="Notifications"
            caption={bound ? 'On — push enabled' : 'Off — muted'}
            value={bound}
            onValueChange={setBound}
            color="primary"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Colors</Text>
          <Row
            label="Primary"
            caption="Default accent"
            value={pri}
            onValueChange={setPri}
            color="primary"
          />
          <View style={styles.divider} />
          <Row
            label="Success"
            caption="Positive / confirm"
            value={suc}
            onValueChange={setSuc}
            color="success"
          />
          <View style={styles.divider} />
          <Row
            label="Danger"
            caption="Destructive toggle"
            value={dan}
            onValueChange={setDan}
            color="danger"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Disabled</Text>
          <Row
            label="Locked on"
            caption="Cannot be changed"
            value={true}
            onValueChange={() => {}}
            color="primary"
            disabled
          />
          <View style={styles.divider} />
          <Row
            label="Locked off"
            caption="Cannot be changed"
            value={false}
            onValueChange={() => {}}
            color="primary"
            disabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color('surface-2') },
  scroll: { padding: 20, paddingBottom: 48 },
  header: { fontSize: 30, fontWeight: '700', color: color('on-surface') },
  sub: { fontSize: 14, color: withAlpha(color('on-surface'), 0.6), marginTop: 4, marginBottom: 20 },
  card: {
    backgroundColor: color('surface'),
    borderRadius: T.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
    ...shadowRest,
  },
  section: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: withAlpha(color('on-surface'), 0.5),
    marginTop: 12,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowText: { flex: 1, paddingRight: 16 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: color('on-surface') },
  rowCaption: { fontSize: 13, color: withAlpha(color('on-surface'), 0.55), marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: color('surface-3') },
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color('surface'),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  disabled: { opacity: 0.5 },
})
