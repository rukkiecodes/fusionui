// Public entry point for the Vue DL component library.

export { createVueDL } from './framework'
export type { VueDLOptions, VueDLInstance } from './framework'

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
