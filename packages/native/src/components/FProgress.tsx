/**
 * FProgress — a linear progress bar. Mirrors the web `<f-progress>` (linear):
 * `value` (0..max), `color`, `height`. The value is clamped to the track.
 */

import { View } from 'react-native'
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'
import { progressFraction } from './helpers'

export interface FProgressProps {
  value?: number
  max?: number
  /** Theme colour name (default primary) or any RN colour. */
  color?: string
  /** Bar thickness in dp (default 6). */
  height?: number
  style?: StyleProp<ViewStyle>
}

export function FProgress({
  value = 0,
  max = 100,
  color = 'primary',
  height = 6,
  style,
}: FProgressProps) {
  const theme = useFusionTheme()
  const c = theme.colors[color] ?? color
  const track = withAlpha(theme.colors['on-surface'], 0.1)
  const width = `${progressFraction(value, max) * 100}%` as DimensionValue

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      style={[
        { height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' },
        style,
      ]}
    >
      <View style={{ height: '100%', width, backgroundColor: c, borderRadius: height / 2 }} />
    </View>
  )
}
