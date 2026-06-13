import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'

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

// Slab geometry — the refractive glass panel laid over the colorful backdrop.
const W = 300
const H = 360
const SX = 40
const SY = 70
const SW = W - SX * 2
const SH = H - SY * 2
const RADIUS = 24 // mirrors LiquidGlassView default radius

function GlassDemo() {
  const Sk = require('@shopify/react-native-skia')
  const { Canvas, RoundedRect, Fill, LinearGradient, vec, Blur, Group, Circle } = Sk
  // draw: vivid gradient backdrop + soft circles -> blurred translucent slab ->
  // hairline bevel -> inner top highlight. Mirrors the engine's intent: a lens
  // slab (tint rgba(255,255,255,0.18)) refracting a colorful scene behind it.
  return (
    <Canvas style={{ width: W, height: H }}>
      {/* Vivid diagonal backdrop: primary -> #c026ff accent -> danger. */}
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(W, H)}
          colors={[color('primary'), '#c026ff', color('danger')]}
        />
      </Fill>
      {/* Soft blurred blobs so the glass blur has shapes to bend. */}
      <Group>
        <Blur blur={18} />
        <Circle cx={W * 0.78} cy={H * 0.22} r={64} color={withAlpha('#ffffff', 0.35)} />
        <Circle cx={W * 0.2} cy={H * 0.8} r={78} color={withAlpha(color('warning'), 0.45)} />
      </Group>

      {/* The glass slab: a blurred translucent panel — the readable, refractive
          middle (tint rgba(255,255,255,0.18), matching the engine intent). */}
      <Group>
        <Blur blur={12} />
        <RoundedRect
          x={SX}
          y={SY}
          width={SW}
          height={SH}
          r={RADIUS}
          color={withAlpha('#ffffff', 0.18)}
        />
      </Group>

      {/* Hairline bevel — sells the thick-glass edge. */}
      <RoundedRect
        x={SX}
        y={SY}
        width={SW}
        height={SH}
        r={RADIUS}
        style="stroke"
        strokeWidth={1.2}
        color={withAlpha('#ffffff', 0.55)}
      />
      {/* Inner top highlight — a thin lighter lip near the upper rim. */}
      <RoundedRect
        x={SX + 1.5}
        y={SY + 1.5}
        width={SW - 3}
        height={SH * 0.4}
        r={RADIUS - 2}
        style="stroke"
        strokeWidth={1}
        color={withAlpha('#ffffff', 0.28)}
      />
    </Canvas>
  )
}

function Fallback() {
  return (
    <View style={[styles.canvasBox, styles.center]}>
      <Text style={styles.loading}>Loading Skia…</Text>
    </View>
  )
}

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.header}>LiquidGlassView</Text>
      <Text style={styles.caption}>
        A refractive translucent slab over a colorful backdrop — real content sits above it.
      </Text>

      <View style={[styles.canvasBox, shadowRest]}>
        <WithSkiaWeb
          getComponent={() => Promise.resolve({ default: GlassDemo })}
          fallback={<Fallback />}
        />
        {/* Real RN content layered above the Skia canvas, centered on the slab. */}
        <View pointerEvents="none" style={styles.overlay}>
          <Text style={styles.glassLabel}>Liquid glass</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color('surface-2'),
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: color('on-surface'),
    marginBottom: 6,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: withAlpha(color('on-surface'), 0.65),
    textAlign: 'center',
    maxWidth: W,
    marginBottom: 20,
  },
  canvasBox: {
    width: W,
    height: H,
    borderRadius: T.radius.lg,
    backgroundColor: color('surface-3'),
    overflow: 'hidden',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: {
    fontSize: 14,
    color: withAlpha(color('on-surface'), 0.6),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: color('on-primary'),
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
})
