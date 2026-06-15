# Installation

## Scaffold a new project

The fastest way to start is the project scaffolder:

```bash
npm create fusionui@latest
# or: pnpm create fusionui / yarn create fusionui / bun create fusionui
```

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
