/**
 * useBackdropSnapshot — feeds native view content into the Skia glass.
 *
 * Android has no compositor API to read pixels behind a view, so to refract
 * a native (non-Skia) background we snapshot it with Skia's
 * `makeImageFromView` and hand the SkImage to <LiquidGlassView backdrop>.
 *
 * Usage:
 *   const bgRef = useRef<View>(null)
 *   const { image, capture } = useBackdropSnapshot(bgRef)
 *   <View ref={bgRef} collapsable={false}>…background…</View>
 *   <LiquidGlassView backdrop={image} … />
 *
 * Call `capture()` whenever the background content changes (after layout,
 * image load, scroll settle, etc.). For fully dynamic backdrops, prefer
 * rendering the backdrop inside the Skia canvas itself.
 */

import { useCallback, useEffect, useState } from 'react'
import type { RefObject } from 'react'
import type { View } from 'react-native'
import { makeImageFromView } from '@shopify/react-native-skia'
import type { SkImage } from '@shopify/react-native-skia'

export function useBackdropSnapshot(viewRef: RefObject<View>, autoCaptureDelay = 80) {
  const [image, setImage] = useState<SkImage | null>(null)

  const capture = useCallback(async () => {
    if (!viewRef.current) return
    try {
      const snap = await makeImageFromView(viewRef as any)
      if (snap) setImage(snap)
    } catch {
      /* view not ready yet — caller can retry */
    }
  }, [viewRef])

  useEffect(() => {
    const t = setTimeout(capture, autoCaptureDelay)
    return () => clearTimeout(t)
  }, [capture, autoCaptureDelay])

  return { image, capture }
}
