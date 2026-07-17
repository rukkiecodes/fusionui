import type { BadgeVariant, BadgeSize, BadgeRadius } from './types'

const variantStyles: Record<
  BadgeVariant,
  { backgroundColor: string; textColor: string; borderColor?: string; borderWidth?: number }
> = {
  default: { backgroundColor: '#ECEEF2', textColor: '#3F4756' },
  success: { backgroundColor: '#D1FAE5', textColor: '#065F46' },
  warning: { backgroundColor: '#FEF3C7', textColor: '#92400E' },
  error: { backgroundColor: '#FEE2E2', textColor: '#991B1B' },
  pending: { backgroundColor: '#E5E7FB', textColor: '#312DB8' },
  notifications: {
    backgroundColor: 'transparent',
    textColor: '#475569',
    borderColor: '#CBD5E1',
    borderWidth: 1,
  },
}

// Badges are small — tight padding, small type, pill by default (see index.tsx).
const sizeStyles: Record<
  BadgeSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { paddingVertical: 2, paddingHorizontal: 7, fontSize: 10 },
  md: { paddingVertical: 3, paddingHorizontal: 9, fontSize: 12 },
  lg: { paddingVertical: 4, paddingHorizontal: 12, fontSize: 14 },
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
