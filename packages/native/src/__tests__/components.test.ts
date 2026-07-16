import { describe, it, expect } from 'vitest'
import {
  initials,
  badgeLabel,
  chipMetrics,
  progressFraction,
  otpCells,
  sanitizeOtp,
} from '../components/helpers'

describe('initials — avatar fallback', () => {
  it('takes the first + last word initials', () => {
    expect(initials('Terry Amagboro')).toBe('TA')
    expect(initials('Lana Del Rey')).toBe('LR')
  })
  it('single word → one letter', () => {
    expect(initials('rukkiecodes')).toBe('R')
  })
  it('handles empty / whitespace', () => {
    expect(initials()).toBe('')
    expect(initials('   ')).toBe('')
  })
})

describe('badgeLabel — capped counts', () => {
  it('caps numbers above max', () => {
    expect(badgeLabel(5)).toBe('5')
    expect(badgeLabel(120)).toBe('99+')
    expect(badgeLabel(120, 9)).toBe('9+')
  })
  it('passes strings through and treats null as empty', () => {
    expect(badgeLabel('new')).toBe('new')
    expect(badgeLabel(undefined)).toBe('')
  })
})

describe('chipMetrics — size steps', () => {
  it('small is tighter than medium', () => {
    expect(chipMetrics('small').fontSize).toBeLessThan(chipMetrics('medium').fontSize)
    expect(chipMetrics('small').paddingHorizontal).toBeLessThan(
      chipMetrics('medium').paddingHorizontal
    )
  })
})

describe('progressFraction — clamped 0..1', () => {
  it('maps value/max to a fraction', () => {
    expect(progressFraction(50, 100)).toBe(0.5)
    expect(progressFraction(3, 12)).toBe(0.25)
  })
  it('clamps out-of-range and guards a zero max', () => {
    expect(progressFraction(-10)).toBe(0)
    expect(progressFraction(250)).toBe(1)
    expect(progressFraction(5, 0)).toBe(0)
  })
})

describe('otp helpers', () => {
  it('splits a value into fixed cells + tracks the active index', () => {
    const { chars, activeIndex } = otpCells('12', 6)
    expect(chars).toEqual(['1', '2', '', '', '', ''])
    expect(activeIndex).toBe(2)
  })
  it('caps the active index at the last cell when full', () => {
    expect(otpCells('123456', 6).activeIndex).toBe(5)
  })
  it('sanitizes to digits, capped at length', () => {
    expect(sanitizeOtp('12ab34', 6)).toBe('1234')
    expect(sanitizeOtp('1234567890', 4)).toBe('1234')
  })
})
