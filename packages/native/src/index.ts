// @rukkiecodes/native — Expo + React Native components mirroring the web contracts,
// sharing the @rukkiecodes/tokens design truth and the signature liquid-glass identity.

// Theme
export {
  FusionProvider,
  useFusionTheme,
  useColor,
  shadowStyle,
  lightTheme,
  darkTheme,
} from './theme'
export type { FusionTheme, FusionProviderProps } from './theme'

// Style primitives — the token-driven layer that replaces the web utility classes
export { useTokens, useVariant, useBreakpoints, useStyles, FBox } from './styles/hooks'
export { resolveVariant, withAlpha } from './styles/variant'
export type { Variant, VariantStyle } from './styles/variant'
export {
  resolveBreakpoint,
  isBreakpointUp,
  BREAKPOINTS,
  BREAKPOINT_ORDER,
} from './styles/breakpoints'
export type { Breakpoint } from './styles/breakpoints'
export { boxStyle } from './styles/box'
export type { FBoxProps } from './styles/box'
export { useMotion, FPressable } from './styles/FPressable'
export type { Motion, FPressableProps } from './styles/FPressable'
export { motionTokens, pressMotion } from './styles/motion'
export type { MotionTokens, PressMotion } from './styles/motion'

// Components (API-mirrored from @rukkiecodes/vue)
export { FButton } from './components/FButton'
export type { FButtonProps, FButtonVariant, FButtonSize } from './components/FButton'
export { FCard } from './components/FCard'
export type { FCardProps } from './components/FCard'
export { FInput } from './components/FInput'
export type { FInputProps } from './components/FInput'
export { FSwitch } from './components/FSwitch'
export type { FSwitchProps } from './components/FSwitch'
export { FAlert } from './components/FAlert'
export type { FAlertProps, AlertVariant, AlertType } from './components/FAlert'

export { FShell } from './components/FShell'
export type { FShellProps } from './components/FShell'

// The shell shape engine (goo path commands → Skia). Shared math with the web.
export { smin, shellCornerCommands, shellContentCommands, buildSkiaPath } from './engine/shell'
export type { PathCommand, ShellContentGeometry } from './engine/shell'

// Signature visual identity — liquid glass (UIGlassEffect on iOS 26, SKSL elsewhere)
export { LiquidGlassView } from './components/LiquidGlassView'
export type { LiquidGlassViewProps } from './components/LiquidGlassView'
export { useBackdropSnapshot } from './components/useBackdropSnapshot'

// The shared glass engine (SDF → Snell refraction) + SKSL shader
export {
  GLASS_SKSL,
  makeGlassUniforms,
  resolveOptions,
  DEFAULT_GLASS_OPTIONS,
} from './engine/liquid-glass'
export type { GlassOptions, GlassGeometry, BezelProfile } from './engine/liquid-glass'
