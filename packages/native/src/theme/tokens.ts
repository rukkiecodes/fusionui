/**
 * Pure theme data + helpers (no React, no JSX) — testable in plain Node and
 * shared by the Provider in ./index.tsx. Fed by the @rukkiecodes/tokens native
 * output: the same design truth the web theme engine consumes.
 */
import {
  radius,
  space,
  font,
  motion,
  opacity,
  zIndex,
  shadows,
  themes,
} from '@rukkiecodes/tokens/native'
import type { NativeThemeDefinition, NativeShadow } from '@rukkiecodes/tokens/native'

export interface FusionTheme {
  dark: boolean
  /** rgb/hex color values, keyed by token name (primary, surface, on-primary…). */
  colors: Record<string, string>
  /** border-opacity, surface-2/3, emphasis opacities… */
  variables: Record<string, string | number>
  radius: typeof radius
  space: typeof space
  font: typeof font
  motion: typeof motion
  opacity: typeof opacity
  zIndex: typeof zIndex
  shadows: Record<string, NativeShadow>
  /** The resting soft shadow for this theme (Vuesax signature). */
  shadowRest: NativeShadow
}

export function buildTheme(def: NativeThemeDefinition): FusionTheme {
  return {
    dark: def.dark,
    colors: def.colors,
    variables: def.variables,
    radius,
    space,
    font,
    motion,
    opacity,
    zIndex,
    shadows,
    shadowRest: def.shadowRest,
  }
}

export const lightTheme: FusionTheme = buildTheme(themes.light)
export const darkTheme: FusionTheme = buildTheme(themes.dark)

/**
 * Map a NativeShadow token to a React Native style object (iOS shadow* +
 * Android elevation). One token → both platforms.
 */
export function shadowStyle(s: NativeShadow, elevation = 0) {
  return {
    shadowColor: s.color,
    shadowOffset: { width: s.offsetX, height: s.offsetY },
    shadowOpacity: s.opacity,
    shadowRadius: s.blur / 2,
    elevation,
  }
}
