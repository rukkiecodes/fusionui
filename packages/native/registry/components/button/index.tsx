/**
 * Button — FusionUI mobile button, with parity to the web FBtn:
 *   variants (solid · relief · shadow · floating · link), size scale, block,
 *   icon / icon-only, circle & square shapes, a loading overlay and an upload
 *   sweep, and href link support. Ships with ButtonGroup for segmented rows.
 * Copy-in source: you own this file after `fusionui add button`.
 *
 * Adapted from reacticx (MIT © rit3zh) — https://github.com/rit3zh/reacticx
 */
import React, { Children, cloneElement, isValidElement, memo, useEffect, useState } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  Text as RNText,
  Linking,
  ActivityIndicator,
  type ViewStyle,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import type { ButtonProps, ButtonGroupProps, ButtonSize } from './types'

// Size scale — padding, font/icon size and default radius per size (Vuesax v4).
const SIZES: Record<
  ButtonSize,
  { fontSize: number; padV: number; padH: number; radius: number; gap: number }
> = {
  xs: { fontSize: 11, padV: 5, padH: 11, radius: 8, gap: 5 },
  sm: { fontSize: 13, padV: 7, padH: 13, radius: 10, gap: 6 },
  md: { fontSize: 15, padV: 10, padH: 16, radius: 12, gap: 8 },
  lg: { fontSize: 17, padV: 13, padH: 20, radius: 15, gap: 9 },
  xl: { fontSize: 19, padV: 16, padH: 26, radius: 18, gap: 10 },
}

// Darken a #hex colour toward black by `amount` (0–1). Used for the relief ledge.
function darkenHex(hex: string, amount = 0.32): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return hex
  let h = m[1]
  if (h.length === 3)
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  const n = parseInt(h, 16)
  const f = (shift: number) => Math.round(((n >> shift) & 255) * (1 - amount))
  return `rgb(${f(16)}, ${f(8)}, ${f(0)})`
}

// #hex → rgba() with the given alpha. Falls back to a translucent white.
function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return `rgba(255,255,255,${alpha})`
  let h = m[1]
  if (h.length === 3)
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

const ButtonComponent: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  block = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  circle = false,
  square = false,
  isLoading = false,
  upload = false,
  onPress,
  href,
  width,
  height,
  backgroundColor = '#195bff',
  gradientColors,
  reliefColor,
  reliefDepth = 4,
  loadingTextBackgroundColor,
  loadingText,
  loadingTextColor = '#fff',
  loadingTextSize = 15,
  showLoadingIndicator = true,
  renderLoadingIndicator,
  borderRadius,
  style,
  loadingTextStyle,
  withPressAnimation = true,
  animationDuration = 250,
  disabled = false,
  accessibilityLabel,
}) => {
  const sz = SIZES[size]
  const isLink = variant === 'link'
  const isRelief = variant === 'relief'
  const fill = gradientColors?.[0] ?? backgroundColor
  const depth = isRelief ? reliefDepth : 0

  let radius = borderRadius ?? sz.radius
  if (square) radius = 0
  if (circle) radius = 999

  const busy = isLoading || upload
  const interactionDisabled = disabled || busy

  const pressProgress = useSharedValue(0)
  const loadProgress = useSharedValue(isLoading ? 1 : 0)
  const uploadProgress = useSharedValue(0)
  const measuredH = useSharedValue(height ?? 0)
  const [, setMeasured] = useState(0)

  useEffect(() => {
    loadProgress.value = withTiming(isLoading ? 1 : 0, {
      duration: animationDuration,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    })
  }, [isLoading, animationDuration])

  useEffect(() => {
    if (upload) {
      uploadProgress.value = 0
      uploadProgress.value = withRepeat(
        withTiming(1, { duration: 750, easing: Easing.linear }),
        -1,
        false
      )
    } else {
      uploadProgress.value = 0
    }
  }, [upload])

  const pressTransform = useAnimatedStyle(() => {
    if (isRelief) {
      return { transform: [{ translateY: interpolate(pressProgress.value, [0, 1], [0, depth]) }] }
    }
    const scale = interpolate(pressProgress.value, [0, 1], [1, isLink ? 1 : 0.95])
    const opacity = isLink ? interpolate(pressProgress.value, [0, 1], [1, 0.55]) : 1
    return { transform: [{ scale }], opacity }
  })

  const loadingOverlayStyle = useAnimatedStyle(() => ({ opacity: loadProgress.value }))

  const uploadStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(uploadProgress.value, [0, 1], [measuredH.value, -measuredH.value]),
      },
    ],
  }))

  const onPressIn = () => {
    if (withPressAnimation && !interactionDisabled) {
      pressProgress.value = withTiming(1, { duration: 100 })
    }
  }
  const onPressOut = () => {
    if (withPressAnimation && !interactionDisabled) {
      pressProgress.value = withTiming(0, { duration: 200 })
    }
  }
  const handlePress = () => {
    if (interactionDisabled) return
    if (href) Linking.openURL(href).catch(() => {})
    onPress?.()
  }

  const loadingBg = loadingTextBackgroundColor ?? fill

  // The button content (icons + label) in normal flow — this is what sizes the
  // button. Loading / upload overlays sit on top without affecting the layout.
  const content = (
    <View
      style={[
        styles.content,
        {
          gap: sz.gap,
          paddingVertical: isLink ? sz.padV / 2 : sz.padV,
          paddingHorizontal: isLink ? 2 : iconOnly ? sz.padV : sz.padH,
        },
      ]}
    >
      {leftIcon}
      {typeof children === 'string' ? (
        <RNText style={{ color: isLink ? fill : '#fff', fontSize: sz.fontSize, fontWeight: '600' }}>
          {children}
        </RNText>
      ) : (
        children
      )}
      {rightIcon}
    </View>
  )

  const overlays = (
    <>
      {isLoading && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlay,
            { backgroundColor: loadingBg, borderRadius: radius },
            loadingOverlayStyle,
          ]}
        >
          {showLoadingIndicator &&
            (renderLoadingIndicator ? (
              renderLoadingIndicator()
            ) : (
              <ActivityIndicator
                color={loadingTextColor}
                size="small"
                style={{ marginRight: loadingText ? 8 : 0 }}
              />
            ))}
          {!!loadingText && (
            <RNText
              style={[
                styles.loadingText,
                { color: loadingTextColor, fontSize: loadingTextSize },
                loadingTextStyle,
              ]}
            >
              {loadingText}
            </RNText>
          )}
        </Animated.View>
      )}
      {upload && (
        <Animated.View
          pointerEvents="none"
          style={[styles.overlay, { backgroundColor: hexToRgba(fill, 0.4) }, uploadStyle]}
        />
      )}
    </>
  )

  const sizeStyle: ViewStyle = {
    ...(width != null ? { width } : block ? { width: '100%' } : {}),
    ...(height != null ? { height } : {}),
    ...(iconOnly ? { aspectRatio: 1 } : {}),
  }

  const onSurfaceLayout = (h: number) => {
    if (h && h !== measuredH.value) {
      measuredH.value = h
      setMeasured(h)
    }
  }

  // The filled surface (gradient, solid, or transparent for link). overflow
  // hidden clips the overlays to the rounded corners.
  const surface = gradientColors ? (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      onLayout={e => onSurfaceLayout(e.nativeEvent.layout.height)}
      style={[styles.surface, { borderRadius: radius }, sizeStyle, style]}
    >
      {content}
      {overlays}
    </LinearGradient>
  ) : (
    <View
      onLayout={e => onSurfaceLayout(e.nativeEvent.layout.height)}
      style={[
        styles.surface,
        { borderRadius: radius, backgroundColor: isLink ? 'transparent' : backgroundColor },
        sizeStyle,
        style,
      ]}
    >
      {content}
      {overlays}
    </View>
  )

  // Per-variant wrapper: relief gets a darker ledge behind; shadow / floating get
  // a drop shadow. The press transform rides on the wrapper.
  let body: React.ReactNode
  if (isRelief) {
    body = (
      <View style={[sizeStyle, { paddingBottom: depth }]}>
        <View
          style={[
            styles.ledge,
            { top: depth, borderRadius: radius, backgroundColor: reliefColor ?? darkenHex(fill) },
          ]}
        />
        <Animated.View style={pressTransform}>{surface}</Animated.View>
      </View>
    )
  } else {
    const wrapperShadow: ViewStyle =
      variant === 'shadow'
        ? {
            borderRadius: radius,
            backgroundColor: fill,
            shadowColor: '#0b1220',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.16,
            shadowRadius: 16,
            elevation: 6,
          }
        : variant === 'floating'
          ? {
              borderRadius: radius,
              backgroundColor: fill,
              shadowColor: fill,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.55,
              shadowRadius: 14,
              elevation: 10,
            }
          : {}
    body = <Animated.View style={[wrapperShadow, pressTransform]}>{surface}</Animated.View>
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={interactionDisabled}
      accessible
      accessibilityRole={href ? 'link' : 'button'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: interactionDisabled, busy }}
      style={[styles.pressable, block && styles.block, disabled && styles.disabled]}
    >
      {body}
    </Pressable>
  )
}

export const Button = memo(ButtonComponent)

// ButtonGroup — a segmented row (or column) of buttons sharing rounded outer
// corners. Children render square; the group clips them to `borderRadius`.
const ButtonGroupComponent: React.FC<ButtonGroupProps> = ({
  children,
  divided = false,
  borderRadius = 12,
  vertical = false,
  dividerColor = 'rgba(255,255,255,0.18)',
  style,
}) => {
  const items = Children.toArray(children).filter(isValidElement)
  return (
    <View
      style={[styles.group, { borderRadius, flexDirection: vertical ? 'column' : 'row' }, style]}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {cloneElement(child as React.ReactElement<ButtonProps>, {
            borderRadius: 0,
            style: [(child as React.ReactElement<ButtonProps>).props.style, styles.groupItem],
          })}
          {divided && i < items.length - 1 && (
            <View
              style={
                vertical
                  ? { height: 1, backgroundColor: dividerColor }
                  : { width: 1, backgroundColor: dividerColor }
              }
            />
          )}
        </React.Fragment>
      ))}
    </View>
  )
}

export const ButtonGroup = memo(ButtonGroupComponent)

export default Button

const styles = StyleSheet.create({
  pressable: { alignSelf: 'flex-start' },
  block: { alignSelf: 'stretch', width: '100%' },
  disabled: { opacity: 0.45 },
  surface: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { fontWeight: '600' },
  group: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  groupItem: { alignSelf: 'auto' },
})
