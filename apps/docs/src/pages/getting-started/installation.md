# Installation

## Scaffold a new project

The fastest way to start is the project scaffolder:

```bash
npm create fusionui@latest
# or: pnpm create fusionui / yarn create fusionui / bun create fusionui
```

It asks two things that matter — what you're building, and what else you want
wired in — and generates a project that installs, builds and lints cleanly on the
first run.

### Targets

| Target       | What you get                                                 |
| ------------ | ------------------------------------------------------------ |
| `vue-spa`    | Vite + Vue 3, client-rendered, with routing                  |
| `vue-pwa`    | The SPA, plus a service worker, manifest and offline support |
| `vue-static` | Vite + Vue, no router — a landing page you can host anywhere |
| `nuxt`       | Server-rendered or statically generated, file-based routing  |
| `expo`       | React Native for iOS and Android, with Skia                  |

### Presets

Pick as many as you like; each one brings its dependency, its config and a small
worked example — never a dangling import.

| Preset                                       | Available on                                         |
| -------------------------------------------- | ---------------------------------------------------- |
| `pinia` — state management                   | Vue targets, Nuxt                                    |
| `router` — Vue Router                        | the static site (the SPA and PWA are routed already) |
| `vueuse` — composition utilities             | Vue targets, Nuxt                                    |
| `i18n` — Vue I18n                            | Vue targets                                          |
| `vitest` — unit testing, with Vue Test Utils | Vue targets, Nuxt                                    |
| `eslint` — ESLint + Prettier                 | all targets                                          |
| `state` — Zustand                            | Expo                                                 |
| `expo-router` — file-based navigation        | Expo                                                 |

Everything is scriptable, so CI and agents never have to answer a prompt:

```bash
fusionui init my-app --target nuxt --features pinia,eslint
fusionui init site --target vue-pwa --no-features -y
fusionui init app --target vue-spa --js          # JavaScript instead of TypeScript
```

FusionUI itself is still only a component library — it doesn't ship a router or a
store. The scaffolder just wires up the ecosystem's standard choices for you, and
you can delete any of them without touching FusionUI.

## Add to an existing project

```bash
pnpm add @rukkiecodes/vue @rukkiecodes/icons
```

Register the plugin and import the styles:

```ts
// main.ts
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

That's it — every `F*` component is registered globally:

<Example file="button/colors" />

## For AI agents & LLMs

These docs are built to be read by coding agents. Every page is available as raw
**Markdown** and **JSON** — just append `.md` or `.json` to its URL (or use the
**Copy / Download** buttons at the top of each page):

```bash
https://rukkiecodes.github.io/fusionui/components/dialog.md
https://rukkiecodes.github.io/fusionui/components/dialog.json
```

There's also an [`llms.txt`](https://rukkiecodes.github.io/fusionui/llms.txt)
index (and a single-file [`llms-full.txt`](https://rukkiecodes.github.io/fusionui/llms-full.txt)),
a [`sitemap.xml`](https://rukkiecodes.github.io/fusionui/sitemap.xml) and a
machine-readable [`manifest.json`](https://rukkiecodes.github.io/fusionui/ai/manifest.json).

### Install the FusionUI skill

Drop the FusionUI **skill** into your agent so it knows the install, conventions
and component patterns.

**Claude Code / Agent SDK** — add it under `.claude/skills/`:

```bash
mkdir -p .claude/skills/fusionui && \
  curl -fsSL https://rukkiecodes.github.io/fusionui/ai/fusionui-skill.md \
  -o .claude/skills/fusionui/SKILL.md
```

**Cursor / Windsurf / others** — save it as a rule, or point the agent at the
index:

```bash
# Cursor rule
curl -fsSL https://rukkiecodes.github.io/fusionui/ai/fusionui-skill.md \
  -o .cursor/rules/fusionui.md

# …or just tell your agent to read:
https://rukkiecodes.github.io/fusionui/llms.txt
```
