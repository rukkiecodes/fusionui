/**
 * FButton — the React Native sibling of the web <FBtn>. Same prop names,
 * variants and states (variant/color/size/loading/disabled/block), so a team
 * moving between platforms re-uses its mental model. Token-driven: every value
 * comes from the FusionUI theme, never a literal.
 *
 * The web feel is carried over with Reanimated: a spring press-scale, the
 * elevated colored shadow, the text-variant tint that fades in while pressed,
 * the diagonal `gradient` variant, and the Vuesax dual-ring loader.
 */
import React, { useMemo } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated'
import { useFusionTheme, useColor, shadowStyle } from '../theme'

// Honor the OS "Reduce Motion" setting on every animation (CLAUDE.md: every
// effect needs a reduced-motion path). With this, springs/timings jump straight
// to their target instead of animating.
const RM = ReduceMotion.System

export type FButtonVariant = 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'gradient'
export type FButtonSize = 'small' | 'default' | 'large'

export interface FButtonProps {
  variant?: FButtonVariant
  /** Theme color name (primary, success…) or any RN color string. */
  color?: string
  size?: FButtonSize
  loading?: boolean
  disabled?: boolean
  /** Stretch to fill the parent width. */
  block?: boolean
  prependIcon?: React.ReactNode
  appendIcon?: React.ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
}

// Intentional component-local size scale — mirrors the web FBtn size steps
// (no matching multi-axis token exists; these are the button's own rhythm).
const SIZES: Record<FButtonSize, { padV: number; padH: number; font: number; radius: number }> = {
  small: { padV: 6, padH: 12, font: 13, radius: 9 },
  default: { padV: 10, padH: 18, font: 15, radius: 12 },
  large: { padV: 14, padH: 24, font: 17, radius: 15 },
}

// The web gradient variant blends the base color toward this violet.
const GRADIENT_TO = '#c026ff'

// expo-linear-gradient is an optional peer — require()'d (not import'd) so bundles
// that never use the gradient variant don't have to install it. Falls back to a
// solid fill when absent.
let LinearGradient: React.ComponentType<any> | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  LinearGradient = require('expo-linear-gradient').LinearGradient
} catch {
  /* not installed — gradient variant renders as a solid fill */
}

export function FButton({
  variant = 'elevated',
  color = 'primary',
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
}: FButtonProps) {
  const theme = useFusionTheme()
  const base = useColor(color) ?? color
  const onBase = useColor(`on-${color}`) ?? '#ffffff'
  const sz = SIZES[size]
  const inactive = disabled || loading
  const reduce = useReducedMotion()

  // Spring press-scale, and a 0→1 value driving the text-variant tint.
  const scale = useSharedValue(1)
  const press = useSharedValue(0)
  const wrapStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  const pillStyle = useAnimatedStyle(() => ({ opacity: press.value }))

  const { container, label, gradient, pill } = useMemo(() => {
    const c: ViewStyle = {
      paddingVertical: sz.padV,
      paddingHorizontal: sz.padH,
      borderRadius: sz.radius,
      alignSelf: block ? 'stretch' : 'flex-start',
    }
    const t: TextStyle = {
      fontSize: sz.font,
      fontWeight: theme.font.weight.medium as TextStyle['fontWeight'],
    }
    let grad: string[] | null = null
    let pillColor: string | null = null
    switch (variant) {
      case 'elevated':
        c.backgroundColor = base
        // The web's hover lift is a colored shadow — carry it as a resting glow.
        Object.assign(c, shadowStyle({ ...theme.shadowRest, color: base }, 4), {
          shadowOpacity: 0.4,
        })
        t.color = onBase
        break
      case 'flat':
        c.backgroundColor = base
        t.color = onBase
        break
      case 'tonal':
        c.backgroundColor = withAlpha(base, 0.15)
        t.color = base
        pillColor = withAlpha(base, 0.18)
        break
      case 'outlined':
        c.backgroundColor = 'transparent'
        c.borderWidth = 2
        c.borderColor = base
        t.color = base
        pillColor = withAlpha(base, 0.12)
        break
      case 'text':
        c.backgroundColor = 'transparent'
        t.color = base
        pillColor = withAlpha(base, 0.12)
        break
      case 'gradient':
        c.backgroundColor = base
        grad = [base, mixHex(base, GRADIENT_TO, 0.5)]
        t.color = '#ffffff'
        break
    }
    return { container: c, label: t, gradient: grad, pill: pillColor }
  }, [variant, base, onBase, sz, block, theme])

  const ringColor =
    variant === 'tonal' || variant === 'outlined' || variant === 'text' ? base : onBase

  return (
    <Animated.View style={[block && styles.block, wrapStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        disabled={inactive}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 220, reduceMotion: RM })
          if (pill)
            press.value = withTiming(1, { duration: theme.motion.duration.fast, reduceMotion: RM })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 220, reduceMotion: RM })
          if (pill)
            press.value = withTiming(0, { duration: theme.motion.duration.base, reduceMotion: RM })
        }}
        style={[styles.base, container, inactive && styles.disabled, style]}
      >
        {gradient && LinearGradient ? (
          <View style={[StyleSheet.absoluteFill, { borderRadius: sz.radius, overflow: 'hidden' }]}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}

        {pill ? (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: sz.radius, backgroundColor: pill },
              pillStyle,
            ]}
          />
        ) : null}

        {loading ? (
          reduce ? (
            <ActivityIndicator size="small" color={ringColor} />
          ) : (
            <DualRingLoader color={ringColor} />
          )
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
    </Animated.View>
  )
}

/**
 * The Vuesax dual-ring loader: two rings spinning at slightly different speeds.
 * Replaces the label while the button keeps its fill.
 */
function DualRingLoader({ color }: { color: string }) {
  const a = useSharedValue(0)
  const b = useSharedValue(0)
  React.useEffect(() => {
    a.value = withRepeat(withTiming(360, { duration: 600, easing: Easing.linear }), -1, false)
    b.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false)
  }, [a, b])
  const aStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${a.value}deg` }] }))
  const bStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${b.value}deg` }] }))
  return (
    <View style={styles.loaderBox}>
      <Animated.View
        style={[
          styles.ring,
          { borderColor: color, borderRightColor: 'transparent', borderBottomColor: 'transparent' },
          aStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ringInner,
          {
            borderColor: withAlpha(/^#[0-9a-f]{6}$/i.test(color) ? color : '#ffffff', 0.5),
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
          },
          bStyle,
        ]}
      />
    </View>
  )
}

/** Compose an 8-digit alpha onto a #rrggbb color (tonal fill). */
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
  // No overflow:hidden here — it would clip the elevated colored shadow on iOS.
  // The gradient clips itself via its own rounded wrapper; the pill is self-rounded.
  base: { alignItems: 'center', justifyContent: 'center' },
  block: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  loaderBox: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  ringInner: { width: 12, height: 12, borderRadius: 6, borderStyle: 'dotted' },
})
