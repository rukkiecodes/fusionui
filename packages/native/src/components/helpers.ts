/**
 * Pure helpers shared by the lightweight components. No React / react-native, so
 * they're unit-testable in plain Node (the tests import this file directly).
 */

/** First letters of the first two words, uppercased — for avatar fallbacks. */
export function initials(name?: string): string {
  if (!name) return ''
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

/** Badge content, capped: numbers above `max` render as `max+`. */
export function badgeLabel(content: string | number | undefined, max = 99): string {
  if (content == null) return ''
  if (typeof content === 'number') return content > max ? `${max}+` : String(content)
  return content
}

/** A progress value as a 0..1 fraction of `max`, clamped. */
export function progressFraction(value: number, max = 100): number {
  if (!(max > 0)) return 0
  const f = value / max
  return f < 0 ? 0 : f > 1 ? 1 : f
}

/** Split an OTP value into `length` cells, plus the index of the next empty one. */
export function otpCells(value: string, length: number): { chars: string[]; activeIndex: number } {
  const clean = (value ?? '').slice(0, length)
  const chars = Array.from({ length }, (_, i) => clean[i] ?? '')
  return { chars, activeIndex: Math.min(clean.length, length - 1) }
}

/** Keep only digits, capped at `length` — OTP sanitisation. */
export function sanitizeOtp(input: string, length: number): string {
  return (input ?? '').replace(/\D/g, '').slice(0, length)
}

export type ChipSize = 'small' | 'medium'

/** Padding + font for a chip size step. */
export function chipMetrics(size: ChipSize): {
  paddingVertical: number
  paddingHorizontal: number
  fontSize: number
} {
  return size === 'small'
    ? { paddingVertical: 3, paddingHorizontal: 10, fontSize: 12 }
    : { paddingVertical: 5, paddingHorizontal: 14, fontSize: 13.5 }
}
