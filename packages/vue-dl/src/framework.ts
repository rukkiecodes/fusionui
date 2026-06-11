import { effectScope } from 'vue'
import type { App, Component } from 'vue'
import { mergeDeep } from './util/helpers'
import { createDefaults, DefaultsSymbol } from './composables/defaults'
import type { DefaultsInstance } from './composables/defaults'
import { createDisplay, DisplaySymbol } from './composables/display'
import type { DisplayOptions } from './composables/display'
import { createTheme, ThemeSymbol } from './composables/theme'
import type { ThemeOptions } from './composables/theme'
import { createIcons, IconSymbol } from './composables/icons'
import type { IconOptions } from './composables/icons'
import { directives as builtinDirectives } from './directives'

export interface VueDLOptions {
  /** A preset that is deep-merged under the rest of the options. */
  blueprint?: Partial<VueDLOptions>
  components?: Record<string, Component>
  directives?: Record<string, unknown>
  defaults?: DefaultsInstance
  display?: DisplayOptions
  theme?: ThemeOptions
  icons?: IconOptions
  ssr?: boolean
}

export interface VueDLInstance {
  install: (app: App) => void
  defaults: ReturnType<typeof createDefaults>
  display: ReturnType<typeof createDisplay>
  theme: ReturnType<typeof createTheme>
  icons: ReturnType<typeof createIcons>
}

/**
 * Creates the Vue DL plugin. Wire it up with `app.use(createVueDL({ ... }))`.
 *
 * Mirrors Vuetify's framework installer: a single `effectScope` owns the global
 * systems (defaults/display/theme/icons), which are provided via injection keys
 * and consumed by every component through composables.
 */
export function createVueDL(options: VueDLOptions = {}): VueDLInstance {
  const { blueprint, ...rest } = options
  const merged = mergeDeep(
    (blueprint ?? {}) as Record<string, unknown>,
    rest as Record<string, unknown>
  ) as VueDLOptions

  const scope = effectScope()
  const instance = scope.run(() => {
    const defaults = createDefaults(merged.defaults)
    const display = createDisplay(merged.display, merged.ssr)
    const theme = createTheme(merged.theme)
    const icons = createIcons(merged.icons)

    function install(app: App): void {
      // Directives → v-ripple, v-click-outside, v-intersect
      for (const key in builtinDirectives) {
        app.directive(key, builtinDirectives[key])
      }
      for (const key in merged.directives) {
        app.directive(key, merged.directives[key] as never)
      }

      // Global component registration (components land in Batch 05+).
      for (const key in merged.components) {
        app.component(key, merged.components[key])
      }

      app.provide(DefaultsSymbol, defaults)
      app.provide(DisplaySymbol, display)
      app.provide(ThemeSymbol, theme)
      app.provide(IconSymbol, icons)

      theme.install(app)
    }

    return { install, defaults, display, theme, icons }
  })

  return instance as VueDLInstance
}
