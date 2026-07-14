import React from 'react'
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

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
// Mix two #rrggbb colors (t in 0..1) — used for the gradient variant (base -> #c026ff).
const mix = (h1, h2, t) => {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const a = p(h1),
    b = p(h2)
  const r = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return '#' + r.map(v => v.toString(16).padStart(2, '0')).join('')
}
const shadowRest = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 4,
}
// ----TOKENS END----

// Size map — mirrors the real native SIZES table (padV/padH/font/radius).
const SIZES = {
  small: { padV: 6, padH: 12, font: 13, radius: 9 },
  default: { padV: 10, padH: 18, font: 15, radius: 12 },
  large: { padV: 14, padH: 24, font: 17, radius: 15 },
}

// Dual-ring loader: two overlaid rings spinning at slightly different
// speeds. Replaces the label while keeping the accent fill behind it.
function DualRingLoader({ ringColor }) {
  const a = useSharedValue(0)
  const b = useSharedValue(0)
  React.useEffect(() => {
    a.value = withRepeat(withTiming(360, { duration: 600, easing: Easing.linear }), -1, false)
    b.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false)
  }, [a, b])
  const aStyle = useAnimatedStyle(() => ({ transform: [{ rotate: a.value + 'deg' }] }))
  const bStyle = useAnimatedStyle(() => ({ transform: [{ rotate: b.value + 'deg' }] }))
  return (
    <View style={styles.loaderBox}>
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: ringColor,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
          },
          aStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ringDotted,
          {
            borderColor: withAlpha(/^#[0-9a-f]{6}$/i.test(ringColor) ? ringColor : '#ffffff', 0.6),
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
          },
          bStyle,
        ]}
      />
    </View>
  )
}

function FButton({
  variant = 'elevated',
  color: colorName = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  block = false,
  onPress,
  children,
}) {
  const base = color(colorName)
  const onBase = color('on-' + colorName)
  const sz = SIZES[size] || SIZES.default
  const inactive = disabled // loading still shows fill, just swaps label

  // Press spring — scale to 0.96 on pressIn, back to 1 on pressOut.
  const scale = useSharedValue(1)
  const press = useSharedValue(0) // 0..1, drives the text-variant pill fade
  const wrapStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  const pillStyle = useAnimatedStyle(() => ({ opacity: press.value }))

  // Per-variant container + label resolution (parallels FBtn.scss variants).
  const container = {
    paddingVertical: sz.padV,
    paddingHorizontal: sz.padH,
    borderRadius: sz.radius,
    alignSelf: block ? 'stretch' : 'flex-start',
  }
  let labelColor = onBase
  let useGradient = false
  let pillColor = null

  switch (variant) {
    case 'elevated':
      container.backgroundColor = base
      // Soft COLORED shadow (shadowColor = accent), keeping the rest offset/blur.
      Object.assign(container, shadowRest, { shadowColor: base, shadowOpacity: 0.4 })
      labelColor = onBase
      break
    case 'flat':
      container.backgroundColor = base
      labelColor = onBase
      break
    case 'tonal':
      container.backgroundColor = withAlpha(base, 0.15)
      labelColor = base
      break
    case 'outlined':
      container.backgroundColor = 'transparent'
      container.borderWidth = 2
      container.borderColor = base
      labelColor = base
      break
    case 'text':
      container.backgroundColor = 'transparent'
      labelColor = base
      pillColor = withAlpha(base, 0.12)
      break
    case 'gradient':
      container.backgroundColor = base
      useGradient = true
      labelColor = '#ffffff'
      break
    default:
      container.backgroundColor = base
  }

  const ringColor =
    variant === 'tonal' || variant === 'outlined' || variant === 'text' ? base : onBase

  return (
    <Animated.View style={[block && styles.blockWrap, wrapStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 220 })
          if (variant === 'text') press.value = withTiming(1, { duration: T.motion.fast })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 220 })
          if (variant === 'text') press.value = withTiming(0, { duration: T.motion.base })
        }}
        style={[styles.base, container, inactive && styles.disabled]}
      >
        {/* Gradient fill, clipped to the button radius, sits behind the label. */}
        {useGradient ? (
          <View style={[StyleSheet.absoluteFill, { borderRadius: sz.radius, overflow: 'hidden' }]}>
            <LinearGradient
              colors={[base, mix(base, '#c026ff', 0.5)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}

        {/* Text-variant pill: faint accent fill that fades in while pressed. */}
        {pillColor ? (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: sz.radius, backgroundColor: pillColor },
              pillStyle,
            ]}
          />
        ) : null}

        {loading ? (
          <DualRingLoader ringColor={ringColor} />
        ) : typeof children === 'string' ? (
          <Text style={{ color: labelColor, fontSize: sz.font, fontWeight: '600' }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </Animated.View>
  )
}

// ---------- Demo ----------

function Group({ title, caption, children }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {caption ? <Text style={styles.groupCaption}>{caption}</Text> : null}
      <View style={styles.groupRow}>{children}</View>
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>FButton</Text>
        <Text style={styles.sub}>
          The React Native sibling of the web {'<f-btn>'} — same variants, colors, sizes and states.
        </Text>

        <Group title="VARIANTS" caption="elevated · flat · tonal · outlined · text · gradient">
          <FButton variant="elevated">Elevated</FButton>
          <FButton variant="flat">Flat</FButton>
          <FButton variant="tonal">Tonal</FButton>
          <FButton variant="outlined">Outlined</FButton>
          <FButton variant="text">Text</FButton>
          <FButton variant="gradient">Gradient</FButton>
        </Group>

        <Group title="COLORS" caption="elevated · primary · success · danger · warning">
          <FButton color="primary">Primary</FButton>
          <FButton color="success">Success</FButton>
          <FButton color="danger">Danger</FButton>
          <FButton color="warning">Warning</FButton>
        </Group>

        <Group title="SIZES" caption="small · default · large">
          <FButton size="small">Small</FButton>
          <FButton size="default">Default</FButton>
          <FButton size="large">Large</FButton>
        </Group>

        <Group title="STATES" caption="loading · disabled">
          <FButton loading>Saving</FButton>
          <FButton disabled>Disabled</FButton>
          <FButton variant="tonal" loading>
            Loading
          </FButton>
        </Group>

        <Group title="BLOCK" caption="full-width gradient">
          <FButton variant="gradient" size="large" block>
            Continue
          </FButton>
        </Group>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color('surface-2') },
  scroll: { padding: 20 },
  h1: { fontSize: 30, fontWeight: '800', color: color('on-surface'), marginBottom: 4 },
  sub: {
    fontSize: 13,
    color: withAlpha(color('on-surface'), 0.6),
    marginBottom: 24,
    lineHeight: 18,
  },

  group: {
    backgroundColor: color('surface'),
    borderRadius: T.radius.lg,
    padding: 18,
    marginBottom: 18,
    ...shadowRest,
    shadowOpacity: 0.06,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: withAlpha(color('on-surface'), 0.55),
  },
  groupCaption: {
    fontSize: 12,
    color: withAlpha(color('on-surface'), 0.4),
    marginTop: 2,
    marginBottom: 14,
  },
  groupRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },

  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blockWrap: { alignSelf: 'stretch', width: '100%' },
  disabled: { opacity: 0.5 },

  loaderBox: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  ringDotted: { borderStyle: 'dotted' },
})
