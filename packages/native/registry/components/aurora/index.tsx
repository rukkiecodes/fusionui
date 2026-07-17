/**
 * Aurora — a Skia + Reanimated aurora effect: flowing bands of light drift over a
 * soft night-sky gradient, driven by an SKSL noise shader on a per-frame clock.
 * Copy-in source: you own this file after `fusionui add aurora`.
 *
 * Needs a dev build — @shopify/react-native-skia is native code Expo Go doesn't ship.
 *
 * Adapted from reacticx (MIT © rit3zh) — https://github.com/rit3zh/reacticx
 */
import React, { memo, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { Canvas, Shader, Fill, Skia } from '@shopify/react-native-skia'
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
  type FrameInfo,
} from 'react-native-reanimated'
import { DEFAULT_AURORA_COLORS, DEFAULT_SKY_COLORS } from './const'
import { AURORA_SHADER } from './conf'
import { hexToRgb } from './helper'
import type { AuroraProps } from './types'

const SHADER = Skia.RuntimeEffect.Make(AURORA_SHADER)!

export const Aurora: React.FC<AuroraProps> = memo<AuroraProps>(
  ({
    width: paramsWidth,
    height: paramsHeight,
    auroraColors = DEFAULT_AURORA_COLORS,
    skyColors = DEFAULT_SKY_COLORS,
    speed = 0.5,
    intensity = 1,
    waveDirection = [9, -9],
  }) => {
    const time = useSharedValue<number>(0)
    useFrameCallback((frameInfo: FrameInfo) => {
      if (frameInfo.timeSincePreviousFrame != null) {
        time.value += frameInfo.timeSincePreviousFrame / 1000
      }
    })

    const color1 = useMemo(
      () => hexToRgb(auroraColors[0] ?? DEFAULT_AURORA_COLORS[0]),
      [auroraColors]
    )
    const color2 = useMemo(
      () => hexToRgb(auroraColors[1] ?? DEFAULT_AURORA_COLORS[1]),
      [auroraColors]
    )
    const color3 = useMemo(
      () => hexToRgb(auroraColors[2] ?? DEFAULT_AURORA_COLORS[2]),
      [auroraColors]
    )
    const skyTop = useMemo(() => hexToRgb(skyColors[0]), [skyColors])
    const skyBottom = useMemo(() => hexToRgb(skyColors[1]), [skyColors])

    const { width: screenWidth, height: screenHeight } = useWindowDimensions()
    const width = paramsWidth ?? screenWidth
    const height = paramsHeight ?? screenHeight * 0.25

    const uniforms = useDerivedValue(() => {
      'worklet'
      return {
        resolution: [width, height] as [number, number],
        time: time.value,
        color1: color1 as [number, number, number],
        color2: color2 as [number, number, number],
        color3: color3 as [number, number, number],
        skyTop: skyTop as [number, number, number],
        skyBottom: skyBottom as [number, number, number],
        speed,
        intensity,
        waveDirection: waveDirection as [number, number],
      }
    }, [width, height, color1, color2, color3, skyTop, skyBottom, speed, intensity, waveDirection])

    return (
      <Canvas style={{ width, height: height + 100 }}>
        <Fill>
          <Shader source={SHADER} uniforms={uniforms} />
        </Fill>
      </Canvas>
    )
  }
)

export default Aurora
