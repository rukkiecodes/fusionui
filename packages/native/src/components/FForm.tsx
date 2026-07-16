/**
 * FForm — a vertical container that spaces its field children evenly. Mirrors
 * the web `<f-form>` as a lightweight layout shell.
 */

import type { ReactNode } from 'react'
import { View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

export interface FFormProps {
  children?: ReactNode
  /** Gap between fields in dp (default 16). */
  gap?: number
  style?: StyleProp<ViewStyle>
}

export function FForm({ children, gap = 16, style }: FFormProps) {
  return <View style={[{ gap }, style]}>{children}</View>
}
