import React, { useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

// FusionUI design tokens — the exact values @rukkiecodes/tokens ships to native.
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
const mix = (h1, h2, t) => {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const a = p(h1),
    b = p(h2)
  return (
    '#' +
    a
      .map((v, i) =>
        Math.round(v + (b[i] - v) * t)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

const TYPE_COLOR = { success: 'success', info: 'primary', warning: 'warning', error: 'danger' }
const TYPE_GLYPH = { success: '✓', info: 'ℹ', warning: '⚠', error: '✕' }
const clamp = n => Math.max(0, Math.min(100, Number(n) || 0))

// FAlert — native sibling of the web <FAlert>. variant/color/type/title/text/icon/
// closable/progress, token-driven; reanimated dismiss + animated progress bar.
function FAlert({
  variant = 'default',
  color: colorProp,
  type,
  title,
  text,
  icon,
  closable = false,
  progress = 0,
  onClose,
  children,
}) {
  const accentName = colorProp || (type ? TYPE_COLOR[type] : 'primary')
  const accent = color(accentName)
  const onAccent = color('on-' + accentName) || '#ffffff'
  const radius = T.radius.md
  const [closed, setClosed] = useState(false)

  const shown = useSharedValue(1)
  const finish = () => {
    setClosed(true)
    onClose && onClose()
  }
  const dismiss = () => {
    shown.value = withTiming(
      0,
      { duration: T.motion.base, reduceMotion: ReduceMotion.System },
      done => {
        'worklet'
        if (done) runOnJS(finish)()
      }
    )
  }
  const outerStyle = useAnimatedStyle(() => ({
    opacity: shown.value,
    transform: [{ translateY: (1 - shown.value) * -6 }],
  }))

  const prog = useSharedValue(clamp(progress))
  useEffect(() => {
    prog.value = withTiming(clamp(progress), {
      duration: T.motion.base,
      reduceMotion: ReduceMotion.System,
    })
  }, [progress])
  const barStyle = useAnimatedStyle(() => ({ width: `${prog.value}%` }))

  if (closed) return null

  const onColor = variant === 'solid' || variant === 'gradient' || variant === 'relief'
  const fg = onColor ? onAccent : accent
  const hasBar =
    variant === 'default' || variant === 'solid' || variant === 'shadow' || variant === 'flat'
  const fullRadius = variant === 'gradient' || variant === 'relief'

  const surface = { borderRadius: radius }
  if (!fullRadius) {
    surface.borderTopLeftRadius = 0
    surface.borderBottomLeftRadius = 0
  }
  let gradient = null
  if (variant === 'default') surface.backgroundColor = withAlpha(accent, 0.1)
  else if (variant === 'solid') surface.backgroundColor = accent
  else if (variant === 'border')
    Object.assign(surface, { backgroundColor: 'transparent', borderWidth: 1, borderColor: accent })
  else if (variant === 'shadow')
    Object.assign(surface, {
      backgroundColor: T.colors.surface,
      shadowColor: accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 9,
      elevation: 4,
    })
  else if (variant === 'flat') surface.backgroundColor = withAlpha(T.colors['on-surface'], 0.04)
  else if (variant === 'gradient') {
    surface.backgroundColor = accent
    gradient = [accent, mix(accent, '#c026ff', 0.45)]
  } else if (variant === 'relief')
    Object.assign(surface, {
      backgroundColor: accent,
      shadowColor: accent,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 4,
    })

  let iconNode = null
  if (icon !== false) {
    if (icon != null && icon !== true)
      iconNode =
        typeof icon === 'string' ? <Text style={[ui.iconGlyph, { color: fg }]}>{icon}</Text> : icon
    else if (type) iconNode = <Text style={[ui.iconGlyph, { color: fg }]}>{TYPE_GLYPH[type]}</Text>
  }

  return (
    <Animated.View style={[ui.outer, outerStyle]}>
      <View style={[ui.body, surface]}>
        {gradient ? (
          <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}
        {hasBar ? (
          <View
            style={[
              ui.bar,
              { backgroundColor: variant === 'solid' ? withAlpha(onAccent, 0.4) : accent },
            ]}
          />
        ) : null}
        <View style={ui.row}>
          {iconNode ? <View style={ui.iconCol}>{iconNode}</View> : null}
          <View style={ui.content}>
            {title ? <Text style={[ui.title, { color: fg }]}>{title}</Text> : null}
            {children ? (
              children
            ) : text ? (
              <Text style={[ui.bodyText, { color: fg }]}>{text}</Text>
            ) : null}
          </View>
          {closable ? (
            <Pressable onPress={dismiss} style={ui.close} accessibilityLabel="Close">
              <Text style={[ui.closeGlyph, { color: fg }]}>✕</Text>
            </Pressable>
          ) : null}
        </View>
        {clamp(progress) > 0 ? (
          <View
            style={[
              ui.progressTrack,
              {
                backgroundColor: withAlpha(onColor ? onAccent : accent, 0.2),
                borderBottomRightRadius: radius,
                borderBottomLeftRadius: fullRadius ? radius : 0,
              },
            ]}
          >
            <Animated.View style={[ui.progressBar, { backgroundColor: fg }, barStyle]} />
          </View>
        ) : null}
      </View>
    </Animated.View>
  )
}

// ---------- Demo ----------
function Group({ title, children }) {
  return (
    <View style={demo.group}>
      <Text style={demo.cap}>{title}</Text>
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  )
}

export default function App() {
  const [closedKey, setClosedKey] = useState(0) // bump to remount the closable demo
  const [pct, setPct] = useState(35)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.colors['surface-2'] }}>
      <ScrollView contentContainerStyle={demo.page}>
        <Text style={demo.h1}>FAlert</Text>

        <Group title="TYPE (success · info · warning · error)">
          <FAlert type="success" title="Saved" text="Your changes were saved." />
          <FAlert type="info" title="Heads up" text="A new version is available." />
          <FAlert
            type="warning"
            title="Storage almost full"
            text="Free up space to keep syncing."
          />
          <FAlert type="error" title="Upload failed" text="Check your connection and retry." />
        </Group>

        <Group title="VARIANTS">
          <FAlert variant="solid" type="success" title="Solid" text="Filled with the accent." />
          <FAlert variant="border" type="info" title="Border" text="Outlined, transparent fill." />
          <FAlert
            variant="shadow"
            type="warning"
            title="Shadow"
            text="Surface with a colored shadow."
          />
          <FAlert variant="flat" type="error" title="Flat" text="Subtle neutral fill." />
          <FAlert
            variant="gradient"
            type="info"
            title="Gradient"
            text="Accent → violet, Skia-free."
          />
          <FAlert variant="relief" color="danger" title="Relief" text="Offset hard shadow." />
        </Group>

        <Group title="CLOSABLE (tap ✕ to dismiss)">
          <View key={closedKey} style={{ gap: 12 }}>
            <FAlert closable type="info" title="Dismiss me" text="I fade out with Reanimated." />
            <FAlert
              closable
              variant="solid"
              color="primary"
              title="Closable solid"
              text="Tap the ✕."
            />
          </View>
          <Pressable onPress={() => setClosedKey(k => k + 1)} style={demo.reset}>
            <Text style={demo.resetText}>Reset closed alerts</Text>
          </Pressable>
        </Group>

        <Group title="PROGRESS (animated bar)">
          <FAlert type="info" title="Uploading…" text={`${pct}% complete`} progress={pct} />
          <View style={demo.pctRow}>
            <Pressable onPress={() => setPct(p => Math.max(0, p - 20))} style={demo.pctBtn}>
              <Text style={demo.pctText}>−20</Text>
            </Pressable>
            <Pressable onPress={() => setPct(p => Math.min(100, p + 20))} style={demo.pctBtn}>
              <Text style={demo.pctText}>+20</Text>
            </Pressable>
          </View>
        </Group>
      </ScrollView>
    </SafeAreaView>
  )
}

const ui = StyleSheet.create({
  outer: { width: '100%' },
  body: { position: 'relative', overflow: 'visible', minHeight: 48, justifyContent: 'center' },
  bar: { position: 'absolute', top: 0, left: 0, width: 3, bottom: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconCol: { width: 24, alignItems: 'center', justifyContent: 'center' },
  iconGlyph: { fontSize: 18, fontWeight: '700' },
  content: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontWeight: '600' },
  bodyText: { fontSize: 14, lineHeight: 20 },
  close: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: { fontSize: 15, fontWeight: '600' },
  progressTrack: { height: 3, width: '100%', overflow: 'hidden' },
  progressBar: { height: 3 },
})

const demo = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
  h1: { fontSize: 22, fontWeight: '700', color: T.colors['on-surface'] },
  group: { gap: 10 },
  cap: { fontSize: 12, fontWeight: '600', color: withAlpha(T.colors['on-surface'], 0.55) },
  reset: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: withAlpha(T.colors.primary, 0.12),
  },
  resetText: { color: T.colors.primary, fontWeight: '600', fontSize: 13 },
  pctRow: { flexDirection: 'row', gap: 10 },
  pctBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: T.colors.primary,
  },
  pctText: { color: '#fff', fontWeight: '600' },
})
