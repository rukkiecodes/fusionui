import { computed, toValue } from 'vue'
import type { CSSProperties, MaybeRefOrGetter } from 'vue'
import { isCssColor } from '../util/colors'

export interface ColorValue {
  background?: string | null | false
  text?: string | null | false
  border?: string | null | false
}

/**
 * Resolves named theme colors to utility classes (`bg-primary`, `text-primary`,
 * `border-primary`) and arbitrary CSS colors (hex/rgb/var) to inline styles —
 * preserving Vuesax's "any color" flexibility on top of the theme palette.
 */
export function useColor(colors: MaybeRefOrGetter<ColorValue>) {
  const resolved = computed(() => {
    const { background, text, border } = toValue(colors)
    const classes: string[] = []
    const styles: CSSProperties = {}

    if (background) {
      if (isCssColor(background)) {
        styles.backgroundColor = background
      } else {
        classes.push(`bg-${background}`)
      }
    }

    if (text) {
      if (isCssColor(text)) {
        styles.color = text
        styles.caretColor = text
      } else {
        classes.push(`text-${text}`)
      }
    }

    if (border) {
      if (isCssColor(border)) {
        styles.borderColor = border
      } else {
        classes.push(`border-${border}`)
      }
    }

    return { classes, styles }
  })

  const colorClasses = computed(() => resolved.value.classes)
  const colorStyles = computed(() => resolved.value.styles)

  return { colorClasses, colorStyles }
}

/** Convenience for a single text color. */
export function useTextColor(color: MaybeRefOrGetter<string | null | false>) {
  return useColor(() => ({ text: toValue(color) }))
}
