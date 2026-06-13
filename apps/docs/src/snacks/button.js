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

// Per-size geometry — mirrors SIZES in the real FButton.tsx.
const SIZES = {
  small: { padV: 6, padH: 12, font: 13, radius: 9 },
  default: { padV: 10, padH: 18, font: 15, radius: 12 },
  large: { padV: 14, padH: 24, font: 17, radius: 15 },
}

// FButton — pure-RN sibling of the web <FBtn>. Same props/variants/states.
function FButton({
  variant = 'elevated',
  color: colorProp = 'primary',
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
}) {
  const [pressed, setPressed] = useState(false)
  const base = color(colorProp)
  const onBase = color('on-' + colorProp) || '#ffffff'
  const sz = SIZES[size] || SIZES.default

  const container = {
    paddingVertical: sz.padV,
    paddingHorizontal: sz.padH,
    borderRadius: sz.radius,
    alignSelf: block ? 'stretch' : 'flex-start',
  }
  const label = { fontSize: sz.font, fontWeight: '500' }

  switch (variant) {
    case 'elevated':
      container.backgroundColor = base
      Object.assign(container, shadowRest, { elevation: 4 })
      label.color = onBase
      break
    case 'flat':
      container.backgroundColor = base
      label.color = onBase
      break
    case 'tonal':
      container.backgroundColor = withAlpha(base, 0.14)
      label.color = base
      break
    case 'outlined':
      container.backgroundColor = 'transparent'
      container.borderWidth = 2
      container.borderColor = base
      label.color = base
      break
    case 'text':
      container.backgroundColor = 'transparent'
      label.color = base
      break
    default:
      break
  }

  const isOff = disabled || loading

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isOff, busy: loading }}
      disabled={isOff}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.base, container, isOff && styles.disabled, pressed && styles.pressed, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={label.color} />
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

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
})

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.colors['surface-2'] }}>
      <ScrollView contentContainerStyle={demo.page}>
        <Text style={demo.h1}>FButton</Text>

        <View style={demo.group}>
          <Text style={demo.cap}>VARIANTS (primary)</Text>
          <View style={demo.row}>
            <FButton variant="elevated">Elevated</FButton>
            <FButton variant="flat">Flat</FButton>
            <FButton variant="tonal">Tonal</FButton>
            <FButton variant="outlined">Outlined</FButton>
            <FButton variant="text">Text</FButton>
          </View>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>COLORS (elevated)</Text>
          <View style={demo.row}>
            <FButton color="primary">Primary</FButton>
            <FButton color="success">Success</FButton>
            <FButton color="danger">Danger</FButton>
            <FButton color="warning">Warning</FButton>
          </View>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>SIZES</Text>
          <View style={demo.row}>
            <FButton size="small">Small</FButton>
            <FButton size="default">Default</FButton>
            <FButton size="large">Large</FButton>
          </View>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>STATES</Text>
          <View style={demo.row}>
            <FButton loading>Loading</FButton>
            <FButton disabled>Disabled</FButton>
          </View>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>BLOCK</Text>
          <FButton block>Full-width block</FButton>
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
