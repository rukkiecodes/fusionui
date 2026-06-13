import React from 'react'
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
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
 * FCard — RN sibling of the web <FCard>. Vuesax soft-shadow surface: themed
 * surface fill, lg (20) radius, soft resting shadow (0 5px 20px rgba(0,0,0,.12)).
 * On the web it LIFTS on hover (transition all .25s); here, when pressable, we
 * give it a Reanimated press-lift: translateY -> -4 + scale 1.01 on pressIn.
 * `flat` drops the shadow for a subtle surface-2 fill + hairline.
 */
function FCard({ flat = false, padding = 16, radius = T.radius.lg, onPress, children }) {
  const lift = useSharedValue(0) // 0 = resting, 1 = lifted
  const pressable = typeof onPress === 'function'

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value * -4 }, { scale: 1 + lift.value * 0.01 }],
  }))

  const cardStyle = [
    styles.base,
    {
      backgroundColor: flat ? color('surface-2') : color('surface'),
      borderRadius: radius,
      padding,
    },
    flat ? { borderWidth: StyleSheet.hairlineWidth, borderColor: color('surface-3') } : shadowRest,
  ]

  if (!pressable) {
    return <Animated.View style={[cardStyle, aStyle]}>{children}</Animated.View>
  }

  const onIn = () => {
    lift.value = withSpring(1, { damping: 16, stiffness: 220 })
  }
  const onOut = () => {
    lift.value = withTiming(0, { duration: T.motion.base })
  }

  return (
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut}>
      <Animated.View style={[cardStyle, aStyle]}>{children}</Animated.View>
    </Pressable>
  )
}

// --- Tiny styled pill (just a View + Text, no extra import) ---
function Pill({ label }) {
  return (
    <View style={[styles.pill, { backgroundColor: color('primary') }]}>
      <Text style={[styles.pillText, { color: color('on-primary') }]}>{label}</Text>
    </View>
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

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>FCard</Text>
        <Text style={styles.sub}>
          Vuesax soft-shadow surface. Token-driven, lg radius, lifts on press.
        </Text>

        <Group caption="Interactive — press to feel the lift">
          <FCard onPress={() => {}}>
            <Text style={styles.title}>Aurora Borealis</Text>
            <Text style={styles.body}>
              Tap and hold this card: it rises (translateY -4) and scales a hair (1.01) on a spring,
              then settles back — the native echo of the web hover lift.
            </Text>
          </FCard>
        </Group>

        <Group caption="Flat — no shadow, subtle surface-2 fill + hairline">
          <FCard flat>
            <Text style={styles.title}>Flat list item</Text>
            <Text style={styles.body}>
              A quieter surface for dense lists. No resting elevation, just a hairline border
              against the page.
            </Text>
          </FCard>
        </Group>

        <Group caption="Custom radius + inline primary pill">
          <FCard onPress={() => {}} radius={T.radius.md} padding={18}>
            <View style={styles.row}>
              <Text style={styles.title}>Release notes</Text>
              <Pill label="NEW" />
            </View>
            <Text style={styles.body}>
              A tighter 12px radius and a small styled pill — pure View + Text, all from the token
              table.
            </Text>
          </FCard>
        </Group>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color('surface-2') },
  scroll: { padding: 20, paddingBottom: 48 },
  h1: { fontSize: 30, fontWeight: '700', color: color('on-surface') },
  sub: { marginTop: 6, marginBottom: 20, fontSize: 14, color: withAlpha(color('on-surface'), 0.6) },
  group: { marginBottom: 26 },
  caption: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: withAlpha(color('on-surface'), 0.5),
  },
  base: { overflow: 'visible' },
  title: { fontSize: 18, fontWeight: '600', color: color('on-surface') },
  body: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: withAlpha(color('on-surface'), 0.8),
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: T.radius.sm,
  },
  pillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
})
