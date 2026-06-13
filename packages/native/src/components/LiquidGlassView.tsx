/**
 * LiquidGlassView — Expo / React Native adapter.
 *
 * Resolution order:
 *   1. iOS 26+        → expo-glass-effect (the real UIKit Liquid Glass:
 *                        system-composited, samples live backdrop, free).
 *   2. Everything else → @shopify/react-native-skia BackdropFilter running
 *                        the GLASS_SKSL runtime shader from core — the same
 *                        Snell-refraction math the web engine rasterizes.
 *
 * Honest platform constraint: Android exposes NO system API to sample pixels
 * behind an arbitrary native view (even expo-blur approximates there). The
 * Skia path therefore refracts what is BEHIND THE FILTER INSIDE A SKIA
 * CANVAS. Two ways to use it:
 *
 *   a. Render your screen's backdrop inside the same <Canvas> (image,
 *      gradient, chart — common for hero sections / media UIs), or
 *   b. Snapshot the underlying view with `makeImageFromView` via the
 *      included `useBackdropSnapshot` and feed it in — good for mostly
 *      static backgrounds; re-snapshot on content change.
 *
 * deps: expo-glass-effect, @shopify/react-native-skia
 */

import { useMemo, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import {
  BackdropFilter,
  Canvas,
  Fill,
  Image as SkiaImage,
  Skia,
  RoundedRect,
  rrect,
  rect,
} from '@shopify/react-native-skia'
import type { SkImage, SkRuntimeEffect } from '@shopify/react-native-skia'
import { GLASS_SKSL, makeGlassUniforms, resolveOptions } from '../engine/liquid-glass'
import type { GlassOptions } from '../engine/liquid-glass'

// expo-glass-effect is optional at runtime (Android bundles don't need it)
let GlassView: React.ComponentType<any> | null = null
let isLiquidGlassAvailable: (() => boolean) | null = null
try {
  // Optional native dependency — must be require()'d, not import'd, so bundles
  // without it (Android) don't fail to resolve.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const glass = require('expo-glass-effect')
  GlassView = glass.GlassView
  isLiquidGlassAvailable = glass.isLiquidGlassAvailable
} catch {
  /* not installed — Skia path only */
}

let effectCache: SkRuntimeEffect | null = null
function getEffect(): SkRuntimeEffect {
  if (!effectCache) {
    effectCache = Skia.RuntimeEffect.Make(GLASS_SKSL)
    if (!effectCache) throw new Error('[fusionui] GLASS_SKSL failed to compile')
  }
  return effectCache
}

export interface LiquidGlassViewProps {
  style?: StyleProp<ViewStyle>
  /** Corner radius (dp). */
  radius?: number
  /** Engine physics/style overrides. */
  options?: Partial<GlassOptions>
  /**
   * Backdrop for the Skia path: a SkImage (e.g. from useBackdropSnapshot or
   * useImage) drawn behind the glass inside the canvas. If omitted, children
   * of <LiquidGlassCanvas> siblings are refracted instead.
   */
  backdrop?: SkImage | null
  /** Force the Skia path even on iOS 26 (useful for visual parity testing). */
  forceShader?: boolean
  children?: React.ReactNode
}

export function LiquidGlassView({
  style,
  radius = 24,
  options,
  backdrop,
  forceShader = false,
  children,
}: LiquidGlassViewProps) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const onLayout = (e: LayoutChangeEvent) => setSize(e.nativeEvent.layout)

  const useNative =
    !forceShader &&
    Platform.OS === 'ios' &&
    GlassView != null &&
    isLiquidGlassAvailable?.() === true

  if (useNative && GlassView) {
    // Real thing: UIGlassEffect. Light bending, adaptivity, and live
    // backdrop sampling are done by the system compositor.
    return (
      <GlassView style={[styles.base, { borderRadius: radius }, style]} glassEffectStyle="regular">
        {children}
      </GlassView>
    )
  }

  const opts = resolveOptions(options)

  const filter = useMemo(() => {
    if (size.width < 2 || size.height < 2) return null
    const builder = Skia.RuntimeShaderBuilder(getEffect())
    const uniforms = makeGlassUniforms({ width: size.width, height: size.height, radius }, opts)
    for (const [name, value] of Object.entries(uniforms)) {
      builder.setUniform(name, Array.isArray(value) ? value : [value])
    }
    // refraction(shader) ∘ blur — blur the backdrop first, then bend it.
    // Bind the shader's `uniform shader image` child to the filter input (the
    // backdrop); input=null means "use the implicit source".
    const refraction = Skia.ImageFilter.MakeRuntimeShader(builder, 'image', null)
    return opts.blur > 0
      ? Skia.ImageFilter.MakeCompose(
          refraction,
          Skia.ImageFilter.MakeBlur(opts.blur, opts.blur, 'clamp' as any, null)
        )
      : refraction
  }, [size.width, size.height, radius, JSON.stringify(opts)])

  const clip = useMemo(
    () => (size.width > 0 ? rrect(rect(0, 0, size.width, size.height), radius, radius) : null),
    [size.width, size.height, radius]
  )

  return (
    <View style={[styles.base, { borderRadius: radius }, style]} onLayout={onLayout}>
      {size.width > 0 && filter && clip && (
        <Canvas style={StyleSheet.absoluteFill}>
          {backdrop && (
            <SkiaImage
              image={backdrop}
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              fit="cover"
            />
          )}
          {/* skia 1.5 types `filter` as a declarative ReactNode, but an
              imperative SkImageFilter is valid at runtime — cast to satisfy TS. */}
          <BackdropFilter filter={filter as never} clip={clip}>
            <Fill color={opts.tint} />
          </BackdropFilter>
          {/* hairline bevel to sell the slab edge */}
          <RoundedRect rect={clip} style="stroke" strokeWidth={1} color="rgba(255,255,255,0.35)" />
        </Canvas>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  content: { position: 'relative', zIndex: 1 },
})
