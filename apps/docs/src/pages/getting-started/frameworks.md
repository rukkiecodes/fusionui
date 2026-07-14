# Frameworks

FusionUI is a component library, not a meta-framework: it plugs into the host you
already use. This page is the wiring for each one — and it is the same code the
scaffolder writes, so what you read here is what `npm create fusionui@latest`
generates.

## Vite + Vue

The `vue-spa`, `vue-pwa` and `vue-static` targets are all Vite + Vue 3. The entry
file creates the plugin, installs it, and imports the stylesheet:

```ts
// src/main.ts
import { createApp } from 'vue'
import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'
import '@rukkiecodes/vue/styles'
import App from './App.vue'

const fusionui = createFusionUI({
  theme: { defaultTheme: 'light' },
  icons: {
    defaultSet: 'fusion',
    sets: { fusion: fusionSet },
    aliases: fusionAliases,
  },
})

createApp(App).use(fusionui).mount('#app')
```

The Vite config needs nothing from FusionUI at all — no transform, no plugin, no
resolver:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

When the project is routed, the scaffolder chains the router onto the same app —
`createApp(App).use(fusionui).use(router).mount('#app')` — and the same goes for
Pinia and Vue I18n. Order doesn't matter to FusionUI.

## Nuxt

**FusionUI is not a Nuxt module, and doesn't need to be.** The library is
SSR-safe by construction — no component touches `window` or `document` at module
load — so Nuxt needs exactly two things: install the plugin onto the Vue app Nuxt
has already created, and register the stylesheet. That is about ten lines, which
is not worth a package to maintain. (This was checked, not assumed: a scaffolded
Nuxt app was server-rendered and asserted to contain FusionUI markup in the
server HTML.)

```ts
// plugins/fusionui.ts
import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'

// Nuxt renders on the server first, so FusionUI is installed onto the Vue app
// Nuxt already created rather than one we create ourselves.
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(
    createFusionUI({
      theme: { defaultTheme: 'light' },
      icons: {
        defaultSet: 'fusion',
        sets: { fusion: fusionSet },
        aliases: fusionAliases,
      },
    })
  )
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // FusionUI ships a prebuilt stylesheet; the plugin in plugins/ installs the
  // components and the theme.
  css: ['@rukkiecodes/vue/styles'],
})
```

Nuxt auto-imports plugins from `plugins/`, so there is nothing to register. Every
`F*` component is globally available in pages and components, on the server and on
the client. There is no Vite config to write — Nuxt owns the build.

If a module ever _is_ wanted, it would be for auto-imports or module options, not
for correctness. See [SSR & Hydration](/features/ssr) for what the SSR guarantee
covers and how client-only content is handled.

## PWA

The `vue-pwa` target is the SPA plus [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/).
The app entry is unchanged — the whole difference is in the Vite config:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'my-app',
        short_name: 'my-app',
        description: 'Built with FusionUI',
        theme_color: '#195bff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
    }),
  ],
})
```

Two things to know:

- **The service worker only registers in a production build.** `npm run dev` will
  never show you offline behaviour or an install prompt. Test with
  `npm run build && npm run preview`, and audit with Lighthouse.
- **`public/icon.svg` is a placeholder.** The manifest points at it, so it has to
  exist for the app to be installable — but replace it with your own before you
  ship.

## Expo / React Native

Mobile is a separate package, **`@rukkiecodes/native`**, and a separate provider:

```bash
npx expo install @shopify/react-native-skia react-native-reanimated expo-linear-gradient
npm i @rukkiecodes/native @rukkiecodes/tokens
```

```tsx
import { FusionProvider, FButton, FCard, FInput } from '@rukkiecodes/native'

export default function App() {
  return (
    <FusionProvider theme="light">
      <FCard>
        <FInput label="Email" placeholder="you@example.com" />
        <FButton variant="elevated" color="primary" onPress={save}>
          Save
        </FButton>
      </FCard>
    </FusionProvider>
  )
}
```

`FusionProvider` is the native counterpart of `createFusionUI`: it feeds the
native output of `@rukkiecodes/tokens` (durations in milliseconds, dimensions as
numbers, shadows as objects — no CSS units) down through context.

### What "the same components" honestly means

You cannot run a Vue component inside React Native, so parity is not shared source.
It is **three shared layers and two implementations**:

- **Shared** — the token values, the component API (names, props, variants,
  states), the interaction and accessibility semantics, and the visual identity.
  `<f-btn variant="elevated" color="primary" loading>` and
  `<FButton variant="elevated" color="primary" loading>` are the same component
  contract.
- **Reimplemented** — the rendering. The web draws with DOM, CSS and (for the
  signature layer) GLSL; native draws with React Native views, Reanimated and
  Skia. Unit tests assert the native variant unions are subsets of the web ones,
  so the two can't silently drift apart.

Component coverage on native is a subset of the web set, and each component runs
live in its own Expo Snack on the [Native (mobile)](/getting-started/native) page.
