/**
 * FAlert — the React Native sibling of the web <FAlert>. Mirrors the contract:
 * variant (default/solid/border/shadow/gradient/flat/relief), color, the `type`
 * semantic shortcut (success/info/warning/error → color + icon), title, text,
 * icon, closable, and progress. Token-driven; Reanimated carries the feel — a
 * dismiss fade-out and an animated progress bar. (The web-only pagination and
 * collapsible content are omitted on native.)
 */
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  ReduceMotion,
} from 'react-native-reanimated'
import { useFusionTheme, useColor, shadowStyle } from '../theme'

export type AlertVariant =
  | 'default'
  | 'solid'
  | 'border'
  | 'shadow'
  | 'gradient'
  | 'flat'
  | 'relief'
export type AlertType = 'success' | 'info' | 'warning' | 'error'

const TYPE_COLOR: Record<AlertType, string> = {
  success: 'success',
  info: 'primary',
  warning: 'warning',
  error: 'danger',
}
const TYPE_GLYPH: Record<AlertType, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  error: '✕',
}

// The web gradient/relief variants blend the accent toward this violet.
const GRADIENT_TO = '#c026ff'

// expo-linear-gradient is an optional peer — require()'d (not import'd) so bundles
// that never use the gradient variant don't have to install it. Solid fallback.
let LinearGradient: React.ComponentType<any> | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LinearGradient = require('expo-linear-gradient').LinearGradient
} catch {
  /* not installed — gradient variant renders as a solid fill */
}

export interface FAlertProps {
  variant?: AlertVariant
  /** Accent color — a theme name (primary, success…) or any RN color string. */
  color?: string
  /** Semantic shortcut: sets a color + default icon. */
  type?: AlertType
  title?: string
  text?: string
  /** `false` hides it; a string renders as a glyph; a node renders as-is. */
  icon?: boolean | string | React.ReactNode
  closable?: boolean
  /** 0–100; renders an animated bottom progress bar. */
  progress?: number
  /** Controlled visibility (default true). */
  visible?: boolean
  onClose?: () => void
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

export function FAlert({
  variant = 'default',
  color,
  type,
  title,
  text,
  icon,
  closable = false,
  progress = 0,
  visible = true,
  onClose,
  style,
  children,
}: FAlertProps) {
  const theme = useFusionTheme()
  const accentName = color ?? (type ? TYPE_COLOR[type] : 'primary')
  const accent = useColor(accentName) ?? accentName
  const onAccent = useColor(`on-${accentName}`) ?? '#ffffff'
  const onSurface = String(theme.colors['on-surface'] ?? '#2c3e50')
  const radius = theme.radius.md

  const [closed, setClosed] = useState(false)

  // Dismiss fade/slide-out, then unmount and notify.
  const shown = useSharedValue(1)
  const finish = () => {
    setClosed(true)
    onClose?.()
  }
  const dismiss = () => {
    shown.value = withTiming(
      0,
      { duration: theme.motion.duration.base, reduceMotion: ReduceMotion.System },
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

  // Animated progress bar width.
  const prog = useSharedValue(clamp(progress))
  useEffect(() => {
    prog.value = withTiming(clamp(progress), {
      duration: theme.motion.duration.base,
      reduceMotion: ReduceMotion.System,
    })
  }, [progress, prog, theme.motion.duration.base])
  const barStyle = useAnimatedStyle(() => ({ width: `${prog.value}%` }))

  if (!visible || closed) return null

  // ---- Per-variant surface + foreground -------------------------------------
  const onColor = variant === 'solid' || variant === 'gradient' || variant === 'relief'
  const fg = onColor ? onAccent : accent
  const hasBar =
    variant === 'default' || variant === 'solid' || variant === 'shadow' || variant === 'flat'
  const fullRadius = variant === 'gradient' || variant === 'relief'

  const surface: ViewStyle = { borderRadius: radius }
  if (!fullRadius) {
    // Left accent bar sits flush against a square left edge (Vuesax).
    surface.borderTopLeftRadius = 0
    surface.borderBottomLeftRadius = 0
  }
  let gradient: string[] | null = null
  switch (variant) {
    case 'default':
      surface.backgroundColor = withAlpha(accent, 0.1)
      break
    case 'solid':
      surface.backgroundColor = accent
      break
    case 'border':
      surface.backgroundColor = 'transparent'
      surface.borderWidth = 1
      surface.borderColor = accent
      break
    case 'shadow':
      surface.backgroundColor = theme.colors.surface
      Object.assign(surface, shadowStyle({ ...theme.shadowRest, color: accent, blur: 18 }, 4), {
        shadowOpacity: 0.18,
      })
      break
    case 'flat':
      surface.backgroundColor = withAlpha(onSurface, 0.04)
      break
    case 'gradient':
      surface.backgroundColor = accent
      gradient = [accent, mixHex(accent, GRADIENT_TO, 0.45)]
      break
    case 'relief':
      surface.backgroundColor = accent
      Object.assign(surface, {
        shadowColor: accent,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 4,
      })
      break
  }

  const iconNode = resolveIcon(icon, type, fg)

  return (
    <Animated.View style={[styles.outer, outerStyle, style]}>
      <View style={[styles.body, surface]}>
        {gradient && LinearGradient ? (
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
              styles.bar,
              { backgroundColor: variant === 'solid' ? withAlpha(onAccent, 0.4) : accent },
            ]}
          />
        ) : null}

        <View style={styles.row}>
          {iconNode ? <View style={styles.iconCol}>{iconNode}</View> : null}
          <View style={styles.content}>
            {title ? <Text style={[styles.title, { color: fg }]}>{title}</Text> : null}
            {children ? (
              <View style={styles.text}>{children}</View>
            ) : text ? (
              <Text style={[styles.bodyText, { color: fg }]}>{text}</Text>
            ) : null}
          </View>
          {closable ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={dismiss}
              style={styles.close}
            >
              <Text style={[styles.closeGlyph, { color: fg }]}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {clamp(progress) > 0 ? (
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: withAlpha(onColor ? onAccent : accent, 0.2),
                borderBottomRightRadius: radius,
                borderBottomLeftRadius: fullRadius ? radius : 0,
              },
            ]}
          >
            <Animated.View style={[styles.progressBar, { backgroundColor: fg }, barStyle]} />
          </View>
        ) : null}
      </View>
    </Animated.View>
  )
}

function resolveIcon(
  icon: FAlertProps['icon'],
  type: AlertType | undefined,
  fg: string
): React.ReactNode {
  if (icon === false) return null
  if (icon != null && icon !== true) {
    return typeof icon === 'string' ? (
      <Text style={[styles.iconGlyph, { color: fg }]}>{icon}</Text>
    ) : (
      icon
    )
  }
  if (type) return <Text style={[styles.iconGlyph, { color: fg }]}>{TYPE_GLYPH[type]}</Text>
  return null
}

const clamp = (n: number | string) => Math.max(0, Math.min(100, Number(n) || 0))

function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
  return `${hex}${a}`
}

/** Linear-blend two #rrggbb colors (t in 0..1) — the gradient variant stop. */
function mixHex(h1: string, h2: string, t: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(h1) || !/^#[0-9a-f]{6}$/i.test(h2)) return h1
  const parse = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const [a, b] = [parse(h1), parse(h2)]
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `#${out.map(v => v.toString(16).padStart(2, '0')).join('')}`
}

const styles = StyleSheet.create({
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
  text: {},
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
