/**
 * FDivider — a hairline separator. Mirrors the web `<f-divider>`: horizontal by
 * default, `vertical` for a column separator, `inset` to indent the line.
 */

import { View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import { withAlpha } from '../styles/variant'

export interface FDividerProps {
  vertical?: boolean
  /** Indent the line from the leading edge (dp). */
  inset?: number
  style?: StyleProp<ViewStyle>
}

export function FDivider({ vertical = false, inset = 0, style }: FDividerProps) {
  const theme = useFusionTheme()
  const line = withAlpha(theme.colors['on-surface'], 0.1)

  return (
    <View
      style={[
        vertical
          ? { width: 1, alignSelf: 'stretch', marginVertical: inset, backgroundColor: line }
          : { height: 1, alignSelf: 'stretch', marginHorizontal: inset, backgroundColor: line },
        style,
      ]}
    />
  )
}
