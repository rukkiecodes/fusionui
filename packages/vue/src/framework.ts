import { createApp, effectScope } from 'vue'
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
import { components as builtinComponents } from './components'
import { FServices } from './services/FServices'
import { useNotify } from './services/notify/useNotify'
import { useLoading } from './services/loading/useLoading'
import { useDialog } from './services/dialog/useDialog'

export interface FusionUIOptions {
  /** A preset that is deep-merged under the rest of the options. */
  blueprint?: Partial<FusionUIOptions>
  components?: Record<string, Component>
  directives?: Record<string, unknown>
  defaults?: DefaultsInstance
  display?: DisplayOptions
  theme?: ThemeOptions
  icons?: IconOptions
  ssr?: boolean
  /** Set false to skip auto-mounting the notify/dialog/loading hosts. */
  services?: boolean
}

export interface FusionUIInstance {
  install: (app: App) => void
  defaults: ReturnType<typeof createDefaults>
  display: ReturnType<typeof createDisplay>
  theme: ReturnType<typeof createTheme>
  icons: ReturnType<typeof createIcons>
}

/**
 * Creates the FusionUI plugin. Wire it up with `app.use(createFusionUI({ ... }))`.
 */
export function createFusionUI(options: FusionUIOptions = {}): FusionUIInstance {
  const { blueprint, ...rest } = options
  const merged = mergeDeep(
    (blueprint ?? {}) as Record<string, unknown>,
    rest as Record<string, unknown>
  ) as FusionUIOptions

  const scope = effectScope()
  const instance = scope.run(() => {
    const defaults = createDefaults(merged.defaults)
    const display = createDisplay(merged.display, merged.ssr)
    const theme = createTheme(merged.theme)
    const icons = createIcons(merged.icons)

    // Registers everything on an app (directives, components, provides, theme).
    // Shared by the main install and the services host app.
    function applyFusionUI(app: App): void {
      for (const key in builtinDirectives) {
        app.directive(key, builtinDirectives[key])
      }
      for (const key in merged.directives) {
        app.directive(key, merged.directives[key] as never)
      }
      for (const key in builtinComponents) {
        app.component(key, builtinComponents[key])
      }
      for (const key in merged.components) {
        app.component(key, merged.components[key])
      }

      app.provide(DefaultsSymbol, defaults)
      app.provide(DisplaySymbol, display)
      app.provide(ThemeSymbol, theme)
      app.provide(IconSymbol, icons)

      theme.install(app)
    }

    let servicesMounted = false
    function mountServices(): void {
      if (servicesMounted || merged.services === false) return
      if (typeof document === 'undefined') return
      servicesMounted = true
      const host = document.createElement('div')
      host.className = 'fui-services-host'
      document.body.appendChild(host)
      const servicesApp = createApp(FServices)
      applyFusionUI(servicesApp)
      servicesApp.mount(host)
    }

    function install(app: App): void {
      applyFusionUI(app)
      app.config.globalProperties.$fui = {
        notify: useNotify().notify,
        loading: useLoading(),
        dialog: useDialog(),
      }
      mountServices()
    }

    return { install, defaults, display, theme, icons }
  })

  return instance as FusionUIInstance
}
