/**
 * FusionUI native theme — a React context fed by the @fusionui/tokens native
 * output. Mirrors the web theming contract: a theme is a set of token
 * overrides; brand themes are token overrides too. Pure data/helpers live in
 * ./tokens (no React) so they're testable in plain Node.
 */
import React, { createContext, useContext, useMemo } from 'react'
import { lightTheme, darkTheme } from './tokens'
import type { FusionTheme } from './tokens'

export type { FusionTheme } from './tokens'
export { lightTheme, darkTheme, buildTheme, shadowStyle } from './tokens'

const ThemeContext = createContext<FusionTheme>(lightTheme)

export interface FusionProviderProps {
  /** 'light' | 'dark' | a custom FusionTheme (brand override). */
  theme?: 'light' | 'dark' | FusionTheme
  children?: React.ReactNode
}

/** Wrap your app once; every FusionUI component reads tokens from here. */
export function FusionProvider({ theme = 'light', children }: FusionProviderProps) {
  const value = useMemo<FusionTheme>(() => {
    if (theme === 'dark') return darkTheme
    if (theme === 'light') return lightTheme
    return theme
  }, [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Read the active theme inside any component. */
export function useFusionTheme(): FusionTheme {
  return useContext(ThemeContext)
}

/** Resolve a theme color by name, else pass the value through. */
export function useColor(name?: string): string | undefined {
  const theme = useFusionTheme()
  if (!name) return undefined
  return theme.colors[name] ?? name
}
