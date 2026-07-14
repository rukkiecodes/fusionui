// Dependency-free date maths for FDatePicker / FDateInput / FCalendar.
//
// FusionUI deliberately ships **no date library**. Everything the pickers need —
// month grids, week starts, month arithmetic, comparison, parsing and formatting
// — is implemented here on the native `Date` API.
//
// Rules this module lives by:
// - Every function is **pure**: it never mutates its arguments and never reads
//   the clock (`Date.now()`/`new Date()`) at module scope. "Today" is always
//   passed in by the caller, which is what keeps the components SSR-safe.
// - All arithmetic goes through the `(year, month, day)` constructor rather than
//   millisecond maths, so DST transitions can never shift a day by an hour.
// - Dates are treated as **local**; ISO strings are parsed as local calendar
//   days (`new Date('2026-08-13')` would be UTC midnight, which is the day
//   before in the Americas — we never do that).

export type DateLike = Date | string | number

export const DAYS_IN_WEEK = 7

/** A reference week whose 1st of January 2023 fell on a Sunday — used to derive
 *  weekday names deterministically, without touching the clock. */
const WEEKDAY_REFERENCE = [2023, 0, 1] as const

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Parse anything date-ish into a local `Date`, or `null` when it isn't one.
 * Accepts `Date`, epoch numbers, `YYYY-MM-DD`, `YYYY-MM-DD HH:mm(:ss)`,
 * `YYYY-MM-DDTHH:mm(:ss)`, `M/D/YYYY`, and finally anything the engine can
 * parse (`"Aug 13, 2026"`).
 */
export function parseDate(value: DateLike | null | undefined): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date) return isValidDate(value) ? new Date(value.getTime()) : null
  if (typeof value === 'number') {
    const fromEpoch = new Date(value)
    return isValidDate(fromEpoch) ? fromEpoch : null
  }

  const str = String(value).trim()

  const dateOnly = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str)
  if (dateOnly) return new Date(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3])

  const dateTime = /^(\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(str)
  if (dateTime) {
    return new Date(
      +dateTime[1],
      +dateTime[2] - 1,
      +dateTime[3],
      +dateTime[4],
      +dateTime[5],
      +(dateTime[6] ?? 0)
    )
  }

  const slashed = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str)
  if (slashed) return new Date(+slashed[3], +slashed[1] - 1, +slashed[2])

  const parsed = new Date(str)
  return isValidDate(parsed) ? parsed : null
}

/** `YYYY-MM-DD` for the **local** calendar day (never UTC-shifted). */
export function toISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1)
}

export function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31)
}

/** Day-count arithmetic via the date constructor, so DST never eats an hour. */
export function addDays(date: Date, amount: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
}

/**
 * Add months, clamping the day to the target month's length so 31 Jan + 1 month
 * is 28/29 Feb rather than rolling over into March.
 */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1)
  const day = Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth()))
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    day,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
}

export function addYears(date: Date, amount: number): Date {
  return addMonths(date, amount * 12)
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** The start of the week containing `date`, honouring `firstDayOfWeek` (0 = Sunday). */
export function startOfWeek(date: Date, firstDayOfWeek = 0): Date {
  const offset = (date.getDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK
  return addDays(startOfDay(date), -offset)
}

export function endOfWeek(date: Date, firstDayOfWeek = 0): Date {
  return addDays(startOfWeek(date, firstDayOfWeek), DAYS_IN_WEEK - 1)
}

/** -1 / 0 / 1 at **day** precision (times are ignored). */
export function compareDate(a: Date, b: Date): number {
  const left = startOfDay(a).getTime()
  const right = startOfDay(b).getTime()
  return left < right ? -1 : left > right ? 1 : 0
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isBefore(a: Date, b: Date): boolean {
  return compareDate(a, b) < 0
}

export function isAfter(a: Date, b: Date): boolean {
  return compareDate(a, b) > 0
}

/** Inclusive on both ends, at day precision. */
export function isWithin(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const from = isAfter(start, end) ? end : start
  const to = isAfter(start, end) ? start : end
  return compareDate(date, from) >= 0 && compareDate(date, to) <= 0
}

export function clampDate(date: Date, min?: Date | null, max?: Date | null): Date {
  if (min && isBefore(date, min)) return startOfDay(min)
  if (max && isAfter(date, max)) return startOfDay(max)
  return date
}

/** Whole days between two dates (b - a), at day precision. */
export function diffInDays(a: Date, b: Date): number {
  const from = startOfDay(a).getTime()
  const to = startOfDay(b).getTime()
  // Round: the raw ms difference can be off by an hour across a DST boundary.
  return Math.round((to - from) / 86400000)
}

/** Every day from `start` to `end`, inclusive. */
export function eachDayOfInterval(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const last = startOfDay(end)
  let cursor = startOfDay(start)
  while (cursor.getTime() <= last.getTime()) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return days
}

/** The ISO-8601 week number (weeks start Monday; week 1 holds the first Thursday). */
export function getWeekNumber(date: Date): number {
  const target = startOfDay(date)
  // Shift to the Thursday of this ISO week, then count weeks from Jan 1st.
  const dayOfWeek = (target.getDay() + 6) % 7 // Mon = 0
  const thursday = addDays(target, 3 - dayOfWeek)
  const firstThursday = new Date(thursday.getFullYear(), 0, 4)
  const firstDayOfWeek = (firstThursday.getDay() + 6) % 7
  const week1Monday = addDays(firstThursday, -firstDayOfWeek)
  return Math.floor(diffInDays(week1Monday, thursday) / DAYS_IN_WEEK) + 1
}

/**
 * The calendar grid for a month: whole weeks (4–6 of them) that cover it,
 * including the adjacent-month days needed to square the grid off.
 */
export function getMonthGrid(year: number, month: number, firstDayOfWeek = 0): Date[][] {
  const first = new Date(year, month, 1)
  const start = startOfWeek(first, firstDayOfWeek)
  const end = endOfWeek(endOfMonth(first), firstDayOfWeek)

  const weeks: Date[][] = []
  let cursor = start
  while (cursor.getTime() <= end.getTime()) {
    const week: Date[] = []
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      week.push(cursor)
      cursor = addDays(cursor, 1)
    }
    weeks.push(week)
  }
  return weeks
}

/** The seven days of the week containing `date`. */
export function getWeekDays(date: Date, firstDayOfWeek = 0): Date[] {
  const start = startOfWeek(date, firstDayOfWeek)
  return Array.from({ length: DAYS_IN_WEEK }, (_, i) => addDays(start, i))
}

// ---------------------------------------------------------------------------
// Names & formatting (Intl, which is built into every JS runtime we target)
// ---------------------------------------------------------------------------

const nameCache = new Map<string, string[]>()

function cached(key: string, build: () => string[]): string[] {
  const hit = nameCache.get(key)
  if (hit) return hit
  const value = build()
  nameCache.set(key, value)
  return value
}

/** Month names for a locale, January-first. */
export function getMonthNames(locale: string, format: 'long' | 'short' = 'long'): string[] {
  return cached(`m:${locale}:${format}`, () => {
    const fmt = new Intl.DateTimeFormat(locale, { month: format })
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2023, i, 1)))
  })
}

/** Weekday names rotated so index 0 is `firstDayOfWeek`. */
export function getWeekdayNames(
  locale: string,
  format: 'long' | 'short' | 'narrow' = 'short',
  firstDayOfWeek = 0
): string[] {
  return cached(`w:${locale}:${format}:${firstDayOfWeek}`, () => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: format })
    const [y, m, d] = WEEKDAY_REFERENCE
    return Array.from({ length: DAYS_IN_WEEK }, (_, i) =>
      fmt.format(new Date(y, m, d + ((i + firstDayOfWeek) % DAYS_IN_WEEK)))
    )
  })
}

const FORMAT_TOKENS = /YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|HH|H|hh|h|mm|ss|A|a/g

/**
 * Format a date with a small token pattern — `YYYY`, `YY`, `MMMM`, `MMM`, `MM`,
 * `M`, `DD`, `D`, `dddd`, `ddd`, `dd`, `HH`, `H`, `hh`, `h`, `mm`, `ss`, `A`,
 * `a`. Anything else in the pattern is passed through verbatim.
 */
export function formatDate(date: Date, pattern: string, locale = 'en-US'): string {
  const hours24 = date.getHours()
  const hours12 = hours24 % 12 || 12

  return pattern.replace(FORMAT_TOKENS, token => {
    switch (token) {
      case 'YYYY':
        return String(date.getFullYear())
      case 'YY':
        return String(date.getFullYear()).slice(-2)
      case 'MMMM':
        return getMonthNames(locale, 'long')[date.getMonth()]
      case 'MMM':
        return getMonthNames(locale, 'short')[date.getMonth()]
      case 'MM':
        return String(date.getMonth() + 1).padStart(2, '0')
      case 'M':
        return String(date.getMonth() + 1)
      case 'DD':
        return String(date.getDate()).padStart(2, '0')
      case 'D':
        return String(date.getDate())
      case 'dddd':
        return getWeekdayNames(locale, 'long')[date.getDay()]
      case 'ddd':
        return getWeekdayNames(locale, 'short')[date.getDay()]
      case 'dd':
        return getWeekdayNames(locale, 'narrow')[date.getDay()]
      case 'HH':
        return String(hours24).padStart(2, '0')
      case 'H':
        return String(hours24)
      case 'hh':
        return String(hours12).padStart(2, '0')
      case 'h':
        return String(hours12)
      case 'mm':
        return String(date.getMinutes()).padStart(2, '0')
      case 'ss':
        return String(date.getSeconds()).padStart(2, '0')
      case 'A':
        return hours24 < 12 ? 'AM' : 'PM'
      case 'a':
        return hours24 < 12 ? 'am' : 'pm'
      default:
        return token
    }
  })
}

/** The long, screen-reader-friendly label for a day cell — "Thursday, August 13, 2026". */
export function formatLongDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

// ---------------------------------------------------------------------------
// Constraints
// ---------------------------------------------------------------------------

export type AllowedDates = DateLike[] | ((date: Date) => boolean) | undefined | null

export interface DateConstraints {
  min?: Date | null
  max?: Date | null
  allowed?: AllowedDates
}

/** Is `date` selectable under the `min` / `max` / `allowedDates` constraints? */
export function isDateAllowed(date: Date, constraints: DateConstraints = {}): boolean {
  const { min, max, allowed } = constraints
  if (min && isBefore(date, min)) return false
  if (max && isAfter(date, max)) return false
  if (typeof allowed === 'function') return allowed(date)
  if (Array.isArray(allowed)) {
    if (!allowed.length) return true
    return allowed.some(value => {
      const parsed = parseDate(value)
      return !!parsed && isSameDay(parsed, date)
    })
  }
  return true
}

/** Is any day of the given month selectable? (used to disable the months view) */
export function isMonthAllowed(
  year: number,
  month: number,
  constraints: DateConstraints = {}
): boolean {
  const first = new Date(year, month, 1)
  const last = endOfMonth(first)
  if (constraints.min && isBefore(last, constraints.min)) return false
  if (constraints.max && isAfter(first, constraints.max)) return false
  if (!constraints.allowed) return true
  return eachDayOfInterval(first, last).some(day => isDateAllowed(day, constraints))
}

/** Is any day of the given year selectable? (used to disable the year view) */
export function isYearAllowed(year: number, constraints: DateConstraints = {}): boolean {
  const first = new Date(year, 0, 1)
  const last = new Date(year, 11, 31)
  if (constraints.min && isBefore(last, constraints.min)) return false
  if (constraints.max && isAfter(first, constraints.max)) return false
  if (!constraints.allowed) return true
  for (let month = 0; month < 12; month++) {
    if (isMonthAllowed(year, month, constraints)) return true
  }
  return false
}

/** Normalise a two-date selection into a sorted `[start, end]` range. */
export function sortRange(a: Date, b: Date): [Date, Date] {
  return isAfter(a, b) ? [startOfDay(b), startOfDay(a)] : [startOfDay(a), startOfDay(b)]
}

/** Minutes since midnight — the vertical position of a timed calendar event. */
export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes()
}
