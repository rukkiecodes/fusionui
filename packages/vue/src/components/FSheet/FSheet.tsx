import { computed, h } from 'vue'
import type { PropType } from 'vue'
import { genericComponent, useRender } from '../../util/defineComponent'
import { propsFactory } from '../../util/propsFactory'
import { makeComponentProps, makeTagProps } from '../../composables/component'
import { makeThemeProps, provideTheme } from '../../composables/theme'
import { makeBorderProps, useBorder } from '../../composables/border'
import { makeRoundedProps, useRounded } from '../../composables/rounded'
import { makeElevationProps, useElevation } from '../../composables/elevation'
import { makeDimensionProps, useDimension } from '../../composables/dimensions'
import { isLightColor, parseColor } from '../../util/colors'

/**
 * Resolve a color name / CSS color to an `r, g, b` triplet so surfaces can apply
 * alpha to it (`rgba(var(--fui-sheet-color), 0.1)`). Shared by every surface that
 * builds on the sheet (banner, footer, system bar).
 */
export function surfaceColorTriplet(color?: string | null): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    const { r, g, b } = parseColor(color)
    return `${r}, ${g}, ${b}`
  }
  return `var(--fui-theme-${color})`
}

/** The contrasting "on" color for a fill — the theme token for a named color, or
 *  black/white by luminance for a custom one (matches FAlert / FAvatar). */
export function surfaceOnTriplet(color?: string | null): string | null {
  if (!color) return null
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return isLightColor(color) ? '0, 0, 0' : '255, 255, 255'
  }
  return `var(--fui-theme-on-${color})`
}

export const makeFSheetProps = propsFactory(
  {
    // Fills the surface with a theme color (primary, success…) or any CSS color.
    // Text automatically flips to the contrasting `on-*` color.
    color: String as PropType<string>,
    ...makeBorderProps(),
    ...makeRoundedProps(),
    ...makeElevationProps(),
    ...makeDimensionProps(),
    ...makeTagProps({ tag: 'div' }),
    ...makeThemeProps(),
    ...makeComponentProps(),
  },
  'FSheet'
)

/**
 * The base surface primitive: a themed block with color, elevation, rounding,
 * a border and dimensions. Most other surfaces (card, banner, footer, system
 * bar) are a sheet with opinions on top.
 */
export const FSheet = genericComponent()({
  name: 'FSheet',
  props: makeFSheetProps(),
  setup(props: any, { slots }: any) {
    provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { roundedClasses } = useRounded(props)
    const { elevationClasses } = useElevation(props)
    const { dimensionStyles } = useDimension(props)

    const colorStyles = computed(() => {
      const color = surfaceColorTriplet(props.color)
      if (!color) return null
      return {
        '--fui-sheet-color': color,
        '--fui-sheet-on': surfaceOnTriplet(props.color),
      }
    })

    useRender(() =>
      h(
        props.tag,
        {
          class: [
            'fui-sheet',
            { 'fui-sheet--colored': !!props.color },
            ...borderClasses.value,
            ...roundedClasses.value,
            ...elevationClasses.value,
            props.class,
          ],
          style: [colorStyles.value, dimensionStyles.value, props.style],
        },
        slots.default?.()
      )
    )
  },
})
