// Pure time helpers for FTimePicker / FTimeInput. No DOM, no Vue — safe to call
// during SSR and trivially unit-testable.

export type TimeFormat = '24hr' | 'ampm'
export type TimePeriod = 'am' | 'pm'
export type TimeUnit = 'hour' | 'minute' | 'second'

/** Either an explicit list of allowed numbers or a predicate. */
export type AllowedTimeValues = number[] | ((value: number) => boolean)

export interface TimeParts {
  hour: number | null
  minute: number | null
  second: number | null
}

export const EMPTY_TIME: TimeParts = { hour: null, minute: null, second: null }

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** `13` → `1`, `0` → `12`. */
export function convert24to12(hour: number): number {
  return hour % 12 || 12
}

/** `1` + `pm` → `13`, `12` + `am` → `0`. */
export function convert12to24(hour: number, period: TimePeriod): number {
  return (hour % 12) + (period === 'pm' ? 12 : 0)
}

export function periodOf(hour: number | null): TimePeriod {
  return hour == null || hour < 12 ? 'am' : 'pm'
}

/**
 * Accepts `HH:mm`, `HH:mm:ss`, `h:mm am`, `h:mm:ss pm` and `Date`. Anything
 * unparsable comes back as all-null rather than throwing — a half-typed value in
 * FTimeInput is a normal, non-exceptional state.
 */
export function parseTime(value: string | Date | null | undefined): TimeParts {
  if (value == null || value === '') return { ...EMPTY_TIME }

  if (value instanceof Date) {
    return { hour: value.getHours(), minute: value.getMinutes(), second: value.getSeconds() }
  }

  const match = String(value)
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?$/)
  if (!match) return { ...EMPTY_TIME }

  const [, rawHour, rawMinute, rawSecond, meridiem] = match
  let hour = Number(rawHour)
  const minute = Number(rawMinute)
  const second = rawSecond != null ? Number(rawSecond) : null

  if (meridiem) {
    if (hour < 1 || hour > 12) return { ...EMPTY_TIME }
    hour = convert12to24(hour, meridiem as TimePeriod)
  }

  if (hour > 23 || minute > 59 || (second != null && second > 59)) return { ...EMPTY_TIME }

  return { hour, minute, second }
}

/** The model value: `HH:mm` (or `HH:mm:ss`). `null` until hour + minute are known. */
export function formatTime(parts: TimeParts, useSeconds = false): string | null {
  const { hour, minute, second } = parts
  if (hour == null || minute == null) return null
  if (useSeconds && second == null) return null
  const base = `${pad(hour)}:${pad(minute)}`
  return useSeconds ? `${base}:${pad(second as number)}` : base
}

/** The human-readable label — this is what screen readers and the title announce. */
export function formatTimeLabel(
  parts: TimeParts,
  format: TimeFormat = '24hr',
  useSeconds = false
): string {
  const { hour, minute, second } = parts
  if (hour == null || minute == null) return ''

  const displayHour = format === 'ampm' ? convert24to12(hour) : hour
  let label = `${format === 'ampm' ? displayHour : pad(displayHour)}:${pad(minute)}`
  if (useSeconds && second != null) label += `:${pad(second)}`
  if (format === 'ampm') label += ` ${periodOf(hour).toUpperCase()}`
  return label
}

export interface TimeValidationOptions {
  min?: string
  max?: string
  allowedHours?: AllowedTimeValues
  allowedMinutes?: AllowedTimeValues
  allowedSeconds?: AllowedTimeValues
}

function matches(allowed: AllowedTimeValues | undefined, value: number): boolean {
  if (Array.isArray(allowed)) return allowed.includes(value)
  if (typeof allowed === 'function') return allowed(value)
  return true
}

function boundary(value: string | undefined, fallback: [number, number, number]): number {
  if (!value) return fallback[0] * 3600 + fallback[1] * 60 + fallback[2]
  const [h = fallback[0], m = fallback[1], s = fallback[2]] = value.split(':').map(Number)
  return h * 3600 + m * 60 + s
}

export interface TimeValidator {
  isAllowedHour: (hour: number) => boolean
  isAllowedMinute: (hour: number | null, minute: number) => boolean
  isAllowedSecond: (hour: number | null, minute: number | null, second: number) => boolean
  isAllowed: (unit: TimeUnit, value: number, parts: TimeParts) => boolean
}

/**
 * `min` / `max` are inclusive `HH:mm[:ss]` bounds; `allowedX` narrows further.
 * Mirrors Vuetify's `useTimeValidation` semantics (a coarser unit only rules out
 * values that can never be reached, so e.g. `min="09:30"` still allows hour 9).
 */
export function createTimeValidator(options: TimeValidationOptions): TimeValidator {
  const minTime = boundary(options.min, [0, 0, 0])
  const maxTime = boundary(options.max, [23, 59, 59])

  function isAllowedHour(hour: number): boolean {
    // An hour is reachable while any second within it falls inside the bounds.
    if (hour * 3600 + 59 * 60 + 59 < minTime) return false
    if (hour * 3600 > maxTime) return false
    return matches(options.allowedHours, hour)
  }

  function isAllowedMinute(hour: number | null, minute: number): boolean {
    if (hour != null) {
      const start = hour * 3600 + minute * 60
      if (start + 59 < minTime) return false
      if (start > maxTime) return false
    }
    return matches(options.allowedMinutes, minute)
  }

  function isAllowedSecond(hour: number | null, minute: number | null, second: number): boolean {
    if (hour != null && minute != null) {
      const time = hour * 3600 + minute * 60 + second
      if (time < minTime) return false
      if (time > maxTime) return false
    }
    return matches(options.allowedSeconds, second)
  }

  function isAllowed(unit: TimeUnit, value: number, parts: TimeParts): boolean {
    if (unit === 'hour') return isAllowedHour(value)
    if (unit === 'minute') return isAllowedMinute(parts.hour, value)
    return isAllowedSecond(parts.hour, parts.minute, value)
  }

  return { isAllowedHour, isAllowedMinute, isAllowedSecond, isAllowed }
}

/** The values a column offers, before the allowed-check narrows them. */
export function unitRange(unit: TimeUnit, format: TimeFormat, period: TimePeriod): number[] {
  if (unit !== 'hour') return Array.from({ length: 60 }, (_, i) => i)
  if (format === 'ampm') {
    const offset = period === 'pm' ? 12 : 0
    return Array.from({ length: 12 }, (_, i) => i + offset)
  }
  return Array.from({ length: 24 }, (_, i) => i)
}

/** The text shown in a column cell (hours read as 12-hour numbers in `ampm`). */
export function unitLabel(unit: TimeUnit, value: number, format: TimeFormat): string {
  if (unit === 'hour' && format === 'ampm') return String(convert24to12(value))
  return pad(value)
}

export { clamp }
