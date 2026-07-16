/**
 * React bindings for the style primitives. These import react-native, so they
 * live apart from the pure resolvers (variant/breakpoints/box) — the tests
 * import the pure files directly and never load the RN runtime.
 */

import { forwardRef, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import type { ViewProps, ViewStyle } from 'react-native'
import { useFusionTheme } from '../theme'
import type { FusionTheme } from '../theme/tokens'
import { resolveVariant } from './variant'
import type { Variant, VariantStyle } from './variant'
import { BREAKPOINT_ORDER, isBreakpointUp, resolveBreakpoint } from './breakpoints'
import type { Breakpoint } from './breakpoints'
import { boxStyle } from './box'
import type { FBoxProps } from './box'

/** The active theme (colours, spacing, radii, type, motion, shadows). */
export function useTokens(): FusionTheme {
  return useFusionTheme()
}

/** Resolve a variant + colour to concrete native styles, memoized. */
export function useVariant(opts: { variant?: Variant; color?: string }): VariantStyle {
  const theme = useFusionTheme()
  return useMemo(() => resolveVariant(theme, opts), [theme, opts.variant, opts.color])
}

export interface Breakpoints {
  width: number
  height: number
  /** The active breakpoint name. */
  name: Breakpoint
  /** True when the viewport is at `bp` or wider. */
  up: (bp: Breakpoint) => boolean
}

/** Responsive breakpoint info off `useWindowDimensions`. */
export function useBreakpoints(): Breakpoints {
  const { width, height } = useWindowDimensions()
  return useMemo(() => {
    const name = resolveBreakpoint(width)
    return { width, height, name, up: (bp: Breakpoint) => isBreakpointUp(name, bp) }
  }, [width, height])
}

/** Build a theme-derived value (e.g. a StyleSheet), memoized on the theme. */
export function useStyles<T>(factory: (theme: FusionTheme) => T): T {
  const theme = useFusionTheme()
  return useMemo(() => factory(theme), [theme])
}

/**
 * `<FBox>` — a token-driven layout primitive. The utility props (`row`, `gap`,
 * `p`, `radius`, `bg`, `align`, `justify`…) map to theme values; any other View
 * prop passes through.
 *
 *   <FBox row gap={2} p={4} radius="lg" bg="surface">…</FBox>
 */
export const FBox = forwardRef<View, FBoxProps & ViewProps>(function FBox(props, ref) {
  const theme = useFusionTheme()
  const {
    row,
    flex,
    gap,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    radius,
    bg,
    align,
    justify,
    style,
    ...rest
  } = props
  const box: FBoxProps = {
    row,
    flex,
    gap,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    radius,
    bg,
    align,
    justify,
  }
  const computed = useMemo(() => boxStyle(theme, box), [theme, JSON.stringify(box)])
  return <View ref={ref} style={[computed, style as ViewStyle]} {...rest} />
})

export { BREAKPOINT_ORDER }
export type { Variant, VariantStyle, Breakpoint, FBoxProps }
