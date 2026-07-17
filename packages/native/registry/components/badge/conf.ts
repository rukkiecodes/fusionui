import type { BadgeVariant, BadgeSize, BadgeRadius } from './types'

const variantStyles: Record<
  BadgeVariant,
  { backgroundColor: string; textColor: string; borderColor?: string; borderWidth?: number }
> = {
  default: { backgroundColor: '#c6e8c5', textColor: '#374151' },
  success: { backgroundColor: '#D1FAE5', textColor: '#065F46' },
  warning: { backgroundColor: '#FEF3C7', textColor: '#92400E' },
  error: { backgroundColor: '#FEE2E2', textColor: '#991B1B' },
  pending: { backgroundColor: '#edeef8', textColor: '#312db8' },
  notifications: {
    backgroundColor: 'transparent',
    textColor: '#dbdbdb',
    borderColor: '#e6e6e6',
    borderWidth: 0.3,
  },
}

const sizeStyles: Record<
  BadgeSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 10 },
  md: { paddingVertical: 7, paddingHorizontal: 15, fontSize: 16 },
  lg: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 25 },
}

const borderRadiusStyles: Record<BadgeRadius, number> = {
  none: 0,
  xs: 1,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
  '7xl': 56,
  '8xl': 64,
  '9xl': 80,
  '10xl': 96,
  full: 9999,
  pill: 500,
}

export { variantStyles, sizeStyles, borderRadiusStyles }
