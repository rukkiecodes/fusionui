// Public entry point for the FusionUI component library.

export { createFusionUI } from './framework'
export type { FusionUIOptions, FusionUIInstance } from './framework'

// Components
export * from './components'

// Programmatic services (notify / loading / dialog)
export * from './services'

// Composables & their prop factories
export * from './composables'

// Directives
export * from './directives'

// Component-authoring utilities
export * from './util'

export const version = '0.0.0'
