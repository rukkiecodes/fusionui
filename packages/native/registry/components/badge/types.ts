import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'notifications' | 'pending'
type BadgeSize = 'sm' | 'md' | 'lg'
type BadgeRadius =
  | 'none'
  | 'xs'
  | 'sm'
  | 'base'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'
  | '10xl'
  | 'full'
  | 'pill'

interface BadgeProps {
  label?: string
  variant?: BadgeVariant
  size?: BadgeSize
  radius?: BadgeRadius
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  icon?: ReactNode
}

export type { BadgeProps, BadgeVariant, BadgeSize, BadgeRadius }
