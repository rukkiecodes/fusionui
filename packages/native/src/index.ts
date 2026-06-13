// @fusionui/native — Expo + React Native components mirroring the web contracts,
// sharing the @fusionui/tokens design truth and the signature liquid-glass identity.

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

// Components (API-mirrored from @fusionui/vue)
export { FButton } from './components/FButton'
export type { FButtonProps, FButtonVariant, FButtonSize } from './components/FButton'
export { FCard } from './components/FCard'
export type { FCardProps } from './components/FCard'
export { FInput } from './components/FInput'
export type { FInputProps } from './components/FInput'
export { FSwitch } from './components/FSwitch'
export type { FSwitchProps } from './components/FSwitch'

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
