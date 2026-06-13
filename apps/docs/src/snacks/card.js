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

// FCard — the React Native sibling of the web <FCard>. The Vuesax soft-shadow
// surface: rounded (lg radius), themed surface fill, optional resting elevation.
// Mirrors packages/native/src/components/FCard.tsx prop-for-prop.
function FCard({ flat = false, padding, radius, style, children }) {
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: color('surface'),
          borderRadius: radius != null ? radius : T.radius.lg,
          padding: padding != null ? padding : T.space.s4,
        },
        !flat && shadowRest,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: { overflow: 'visible' },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: color('on-surface'),
    marginBottom: T.space.s2,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 19,
    color: withAlpha(color('on-surface'), 0.7),
  },
})

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.colors['surface-2'] }}>
      <ScrollView contentContainerStyle={demo.page}>
        <Text style={demo.h1}>FCard</Text>

        <View style={demo.group}>
          <Text style={demo.cap}>Elevated (soft Vuesax shadow)</Text>
          <FCard>
            <Text style={styles.cardTitle}>Resting elevation</Text>
            <Text style={styles.cardBody}>
              A surface card with the default lg radius and the soft resting shadow. This is the
              everyday FusionUI panel.
            </Text>
          </FCard>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Flat (no shadow, surface-2 fill + border)</Text>
          <FCard
            flat
            style={{
              backgroundColor: color('surface-2'),
              borderWidth: 1,
              borderColor: withAlpha(color('on-surface'), 0.08),
            }}
          >
            <Text style={styles.cardTitle}>Flat list item</Text>
            <Text style={styles.cardBody}>
              The flat prop drops the resting shadow. Here it leans on a subtle border and surface-2
              fill instead — ideal for dense lists.
            </Text>
          </FCard>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Custom radius + tighter padding</Text>
          <FCard radius={T.radius.sm} padding={T.space.s5}>
            <Text style={styles.cardTitle}>radius=8, padding=24</Text>
            <Text style={styles.cardBody}>
              radius and padding override the lg / s4 token defaults while keeping the elevated
              surface treatment intact.
            </Text>
          </FCard>
        </View>

        <View style={demo.group}>
          <Text style={demo.cap}>Composed (row of mini cards)</Text>
          <View style={demo.row}>
            <FCard style={{ flexGrow: 1, minWidth: 130 }} padding={T.space.s3}>
              <Text style={[styles.cardTitle, { color: color('primary') }]}>128</Text>
              <Text style={styles.cardBody}>Active sessions</Text>
            </FCard>
            <FCard style={{ flexGrow: 1, minWidth: 130 }} padding={T.space.s3}>
              <Text style={[styles.cardTitle, { color: color('success') }]}>99.9%</Text>
              <Text style={styles.cardBody}>Uptime</Text>
            </FCard>
          </View>
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
