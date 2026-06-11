// Generic, framework-agnostic helpers shared across composables.

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return isObject(value) && (value.constructor === Object || value.constructor == null)
}

/** Deep-merge `source` into a copy of `target`. Arrays are replaced, not merged. */
export function mergeDeep(
  target: Record<string, unknown> = {},
  source: Record<string, unknown> = {}
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target }
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      out[key] = mergeDeep(targetValue, sourceValue)
    } else {
      out[key] = sourceValue
    }
  }
  return out
}

export function toKebabCase(str = ''): string {
  return str
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
}

let uid = 0
/** Process-unique incrementing id, useful for generating element ids. */
export function getUid(): number {
  return uid++
}

/** Convert a numeric or numeric-string value to a px string, otherwise pass through. */
export function convertToUnit(
  str: string | number | null | undefined,
  unit = 'px'
): string | undefined {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str)) {
    return String(str)
  } else if (!isFinite(+str)) {
    return undefined
  } else {
    return `${Number(str)}${unit}`
  }
}

export function destructured<T extends object>(obj: T, keys: (keyof T)[]): Partial<T> {
  return keys.reduce<Partial<T>>((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {})
}
