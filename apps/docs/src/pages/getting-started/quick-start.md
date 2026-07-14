# Quick Start

Zero to a rendered button. There are two ways in — scaffold a project, or add
FusionUI to one you already have.

## Scaffold a project

```bash
npm create fusionui@latest
# or: pnpm create fusionui / yarn create fusionui / bun create fusionui
```

It asks what you're building (`vue-spa`, `vue-pwa`, `vue-static`, `nuxt`, `expo`)
and what else to wire in, then generates a project that installs, builds and lints
cleanly on the first run — FusionUI is already registered, the stylesheet is
already imported, and there is a working demo page to delete.

```bash
cd my-app
npm install
npm run dev
```

Non-interactive, for CI and agents:

```bash
fusionui init my-app --target vue-spa --features pinia,eslint
```

The full target and preset catalogue is on the [Installation](/getting-started/installation)
page.

## Add to an existing app

```bash
pnpm add @rukkiecodes/vue @rukkiecodes/icons
```

Then three things in your entry file: create the plugin, install it, import the
stylesheet. This is exactly what the scaffolder generates.

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

- **`createFusionUI(options)`** builds the plugin. Every option is optional —
  `theme`, `icons`, `defaults`, `display`, `components`, `directives`, a
  `blueprint` to deep-merge under the rest, `ssr`, and `services`.
- **`@rukkiecodes/vue/styles`** is the one stylesheet: the design tokens, the
  component CSS and the [utility classes](/utilities/flexbox). Import it once.
- **The icons** are a separate package. `fusionSet` registers the whole set by
  name (`icon="bell"`), `fusionAliases` maps the semantic `$` names components
  use internally (`$success`, `$close`). See [Icons](/getting-started/icons).

The plugin is not optional. Components inject the theme and defaults instances it
provides — mount one without it and you get
`[FusionUI] Could not find theme instance`.

## Your first button

Installing the plugin registers **every `F*` component globally**, so nothing
needs importing at the point of use. Kebab-case or PascalCase, both work.

```vue
<template>
  <f-btn color="primary" prepend-icon="check" @click="save">Save</f-btn>
</template>
```

<Example file="getting-started/hello" />

That's the whole loop. From here, [Theme & Colors](/getting-started/theme) covers
re-skinning, and [Design Tokens](/getting-started/design-tokens) covers the values
everything is built from.

## Importing components by name

Every component is also a named export, which is what you want in a codebase that
bans global components, in unit tests, and anywhere you'd rather the editor could
jump to the definition:

```vue
<script setup lang="ts">
import { FBtn, FCard } from '@rukkiecodes/vue'
</script>

<template>
  <FCard>
    <FBtn color="primary">Save</FBtn>
  </FCard>
</template>
```

Be clear-eyed about what this buys you today: `createFusionUI` registers the full
component set on install, so calling it pulls the library into the module graph
whether or not you import components by name, and the stylesheet ships whole.
Named imports buy explicitness, not a smaller bundle. (Icons are the exception —
`@rukkiecodes/icons` has a per-icon export and genuinely tree-shakes down to the
ones you import.) The shipped bundles are held to gzip ceilings by `pnpm size`, so
the full-barrel cost is tracked rather than left to drift.

## What the plugin installs

| Piece                   | What it gives you                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Components & directives | Every `F*` component, globally registered                                                            |
| `theme`                 | Runtime CSS custom properties, `useTheme()`, `theme.toggle()` — see [Theme](/getting-started/theme)  |
| `defaults`              | Per-component prop defaults, globally or per subtree — see [Theme & Defaults](/components/providers) |
| `display`               | Reactive breakpoints (`useDisplay()`)                                                                |
| `icons`                 | The icon sets and `$` aliases                                                                        |
| Services                | `$fui.notify`, `$fui.loading`, `$fui.dialog`, mounted into a host element on `document.body`         |

The services host only mounts in the browser, and `services: false` skips it
entirely if you'd rather mount the notification and dialog hosts yourself.

## Next

- [Frameworks](/getting-started/frameworks) — Vite, Nuxt, PWA and Expo wiring.
- [SSR & Hydration](/features/ssr) — the server-rendering contract.
- [Accessibility](/features/accessibility) — what's guaranteed, and what isn't yet.
