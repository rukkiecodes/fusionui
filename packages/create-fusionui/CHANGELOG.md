# create-fusionui

## 0.2.0

### Minor Changes

- `init` now asks what you are building, then what to wire into it.

  **Targets** — `vue-spa` (Vite + Vue 3, routed) · `vue-pwa` (the SPA plus a service
  worker, manifest and offline support) · `vue-static` (Vite + Vue, no router) ·
  `nuxt` (SSR or static generation, file-based routing) · `expo` (React Native with
  Skia). The old prompt only offered "Web" or "Mobile".

  **Presets** — Pinia, Vue Router, VueUse, Vue I18n, FusionUI shaders, Vitest, and
  ESLint + Prettier; Zustand and Expo Router on mobile. Each is gated by target, so
  Expo is never offered Pinia and the SPA is never offered a router it already has.
  Every preset brings its dependency, its config and a small worked example — never
  a dangling import.

  Everything is scriptable, so CI and agents never have to answer a prompt:

  ```sh
  fusionui init my-app --target nuxt --features pinia,eslint
  fusionui init site --target vue-pwa --no-features -y
  fusionui init app --target vue-spa --js
  ```

  The starter itself is now minimal: the liquid-glass sample is gone (it has a docs
  page), and the app opens in the operating system's theme and follows it — via
  `matchMedia` on Vite, `import.meta.client` on Nuxt, and `useColorScheme()` on Expo.

  Also fixed: the Expo `tsconfig` resolved modules the Node 10 way, so
  `@rukkiecodes/native`'s import of `@rukkiecodes/tokens/native` (an exports-map
  subpath) would not typecheck for anyone; and a freshly scaffolded project failed
  its own `npm run lint` on `vue/multi-word-component-names`, which every
  single-word page (Home, About) trips.

  Old flags still work: `--ts`, `--js`, `--template default|typescript|expo`.

## 0.1.0

### Minor Changes

- 68b6a9e: Initial public release of FusionUI — a Vue 3 design library with the engineering
  stability of Vuetify and the look of Vuesax v4, blended with Apple-style
  typography and whitespace. Includes 50+ components, the Feather icon set,
  programmatic notify/dialog/loading services, a documentation site, and the
  `npm create fusionui` scaffolder.
