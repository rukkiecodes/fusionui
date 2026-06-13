import type { App, Plugin } from 'vue'
import { FShaderSurface } from './components/FShaderSurface'
import { vShader } from './directives/shader'

export { FShaderSurface } from './components/FShaderSurface'
export { vShader } from './directives/shader'
export type { ShaderDirectiveValue } from './directives/shader'
export { effects, gradient, grain, glow, displace, resolveEffect } from './effects'
export type { EffectName } from './effects'
export { supportsWebGL2, prefersReducedMotion, shouldRunShader } from './runtime/capability'
export { toRgb01 } from './runtime/color'
export type { ShaderEffect, ShaderValues, ShaderRunner } from './types'

/**
 * Optional plugin: registers <FShaderSurface> globally and the `v-shader`
 * directive. Tree-shakeable — import the pieces directly if you prefer.
 */
export const FusionShaders: Plugin = {
  install(app: App) {
    app.component('FShaderSurface', FShaderSurface)
    app.directive('shader', vShader)
  },
}
