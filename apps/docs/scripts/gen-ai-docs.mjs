#!/usr/bin/env node
// Emit AI-/crawler-friendly artifacts alongside the built docs SPA:
//   dist/<route>.md          — each page as self-contained markdown
//   dist/<route>.json        — the same, structured
//   dist/llms.txt            — llmstxt.org index of every page
//   dist/llms-full.txt       — every page's markdown concatenated
//   dist/sitemap.xml         — all human routes
//   dist/robots.txt          — allow crawlers + point at sitemap/llms.txt
//   dist/ai/manifest.json    — machine-readable page index (md/json URLs)
//   dist/ai/fusionui-skill.md — a skill that teaches agents to use FusionUI
//
// `<Example>` and `<ApiTable>` are expanded to real code / prop tables so the
// markdown is useful on its own. Run after `vite build`.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enrich, titleOf, descOf } from '../src/util/enrich.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const docs = join(here, '..')
const pagesDir = join(docs, 'src', 'pages')
const examplesDir = join(docs, 'src', 'examples')
const apiDir = join(docs, 'src', 'api')
const dist = join(docs, 'dist')

const ORIGIN = 'https://rukkiecodes.github.io'
const BASE = (process.env.DOCS_BASE ?? '/').replace(/\/+$/, '') // '/fusionui' | ''
const SITE = ORIGIN + BASE

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}

// File lookups for the shared enricher (Node fs side).
const resolveExample = f => {
  const p = join(examplesDir, f + '.vue')
  return existsSync(p) ? readFileSync(p, 'utf8') : null
}
const resolveApi = n => {
  const p = join(apiDir, n + '.json')
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

function routeOf(file) {
  let key = relative(pagesDir, file).replace(/\\/g, '/').replace(/\.md$/, '')
  if (key === 'index') return '' // home
  return key.replace(/\/index$/, '')
}

const SECTION = {
  'getting-started': 'Getting Started',
  components: 'Components',
  examples: 'Examples',
}
const pages = []

for (const file of walk(pagesDir)) {
  const route = routeOf(file)
  const raw = readFileSync(file, 'utf8')
  const md = enrich(raw, resolveExample, resolveApi)
  const title = titleOf(raw)
  const description = descOf(raw)
  const urlPath = route ? '/' + route : '/'
  const slug = route || 'index'
  const section = route === '' ? 'Getting Started' : SECTION[route.split('/')[0]] || 'Guide'

  // write dist/<slug>.md and .json
  const mdPath = join(dist, slug + '.md')
  const jsonPath = join(dist, slug + '.json')
  mkdirSync(dirname(mdPath), { recursive: true })
  const front = `<!-- ${title} — FusionUI docs. Page: ${SITE}${urlPath} -->\n\n`
  writeFileSync(mdPath, front + md + '\n')
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        title,
        description,
        section,
        route: urlPath,
        url: SITE + urlPath,
        markdownUrl: `${SITE}/${slug}.md`,
        markdown: md,
      },
      null,
      2
    ) + '\n'
  )
  pages.push({ title, description, section, route: urlPath, slug, url: SITE + urlPath, md })
}

// Stable order: Getting Started, Components, Examples, then the rest.
const order = ['Getting Started', 'Components', 'Examples', 'Guide']
pages.sort(
  (a, b) => order.indexOf(a.section) - order.indexOf(b.section) || a.route.localeCompare(b.route)
)

// ---- llms.txt -------------------------------------------------------------
let llms = `# FusionUI\n\n> A soft, modern Vue 3 component library — the look of Vuesax with the engineering stability of Vuetify. Install with \`npm i @rukkiecodes/vue @rukkiecodes/icons\`. Every page below is also available as raw markdown (append \`.md\`) and JSON (append \`.json\`).\n\n`
let lastSection = ''
for (const p of pages) {
  if (p.section !== lastSection) {
    llms += `\n## ${p.section}\n\n`
    lastSection = p.section
  }
  llms += `- [${p.title}](${SITE}/${p.slug}.md)${p.description ? ': ' + p.description : ''}\n`
}
llms += `\n## Optional\n\n- [Full docs (single file)](${SITE}/llms-full.txt): every page concatenated\n- [AI skill](${SITE}/ai/fusionui-skill.md): drop-in instructions for coding agents\n`
writeFileSync(join(dist, 'llms.txt'), llms)

// ---- llms-full.txt --------------------------------------------------------
const full = pages.map(p => `# ${p.title}\nSource: ${p.url}\n\n${p.md}`).join('\n\n---\n\n')
writeFileSync(join(dist, 'llms-full.txt'), full + '\n')

// ---- sitemap.xml ----------------------------------------------------------
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map(p => `  <url><loc>${p.url}</loc></url>`).join('\n') +
  `\n</urlset>\n`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)

// ---- robots.txt -----------------------------------------------------------
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# AI-readable index: ${SITE}/llms.txt\nSitemap: ${SITE}/sitemap.xml\n`
)

// ---- ai/manifest.json -----------------------------------------------------
mkdirSync(join(dist, 'ai'), { recursive: true })
writeFileSync(
  join(dist, 'ai', 'manifest.json'),
  JSON.stringify(
    {
      name: 'FusionUI',
      description: 'A Vue 3 component library (Vuesax look, Vuetify stability).',
      install: 'npm i @rukkiecodes/vue @rukkiecodes/icons',
      llms: `${SITE}/llms.txt`,
      skill: `${SITE}/ai/fusionui-skill.md`,
      pages: pages.map(p => ({
        title: p.title,
        section: p.section,
        url: p.url,
        markdown: `${SITE}/${p.slug}.md`,
        json: `${SITE}/${p.slug}.json`,
      })),
    },
    null,
    2
  ) + '\n'
)

// ---- ai/fusionui-skill.md -------------------------------------------------
const components = existsSync(apiDir)
  ? readdirSync(apiDir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
      .sort()
  : []
const skill = `---
name: fusionui
description: Build Vue 3 UIs with FusionUI (@rukkiecodes/vue) — components, theming, icons and services.
---

# FusionUI skill

FusionUI is a Vue 3 component library with the look of Vuesax and the engineering
stability of Vuetify. Use this when building a Vue 3 app with FusionUI.

## Install

\`\`\`bash
npm i @rukkiecodes/vue @rukkiecodes/icons
# or scaffold a new app: npm create fusionui@latest
\`\`\`

\`\`\`ts
// main.ts — register the plugin once
import { createApp } from 'vue'
import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'
import '@rukkiecodes/vue/styles'
import App from './App.vue'

createApp(App)
  .use(createFusionUI({
    theme: { defaultTheme: 'light' },
    icons: { defaultSet: 'fusion', sets: { fusion: fusionSet }, aliases: fusionAliases },
  }))
  .mount('#app')
\`\`\`

## Conventions

- Components are \`F*\` and globally registered (kebab in templates: \`<f-btn>\`, \`<f-dialog>\`).
- CSS classes are \`fui-*\`; design tokens are CSS custom properties named \`--fui-*\`.
- A \`color\` prop takes a theme name (\`primary\`, \`secondary\`, \`success\`, \`danger\`, \`warning\`) or any CSS color.
- A \`variant\` prop takes: \`elevated\` \`flat\` \`tonal\` \`outlined\` \`text\` \`plain\` \`gradient\` \`relief\` \`line\` \`floating\` \`shadow\`.
- Light/dark theme is a class on \`<html>\`; toggle with \`useTheme().toggle()\`.
- Directives: \`v-ripple\`, \`v-click-outside\`, \`v-intersect\`.

## Rules that are easy to get wrong

These are the mistakes to avoid — each one fails **silently**, with no warning:

1. **Color tokens are RGB triplets, not colors.** \`--fui-theme-primary\` is
   \`25,91,255\`. So \`color: var(--fui-theme-primary)\` is INVALID and the browser
   drops the whole declaration. Always wrap it:
   \`\`\`css
   color: rgb(var(--fui-theme-primary));
   background: rgba(var(--fui-theme-primary), 0.12);
   border: 1px solid rgba(var(--fui-border-color), 0.12);  /* also a triplet */
   \`\`\`
2. **Never hard-code a spacing, radius, color or shadow value.** Use
   \`var(--fui-space-1..7)\`, \`var(--fui-radius-sm|md|lg|xl|pill|circle)\`,
   \`var(--fui-elevation-0..24)\`.
3. **Do not fight the theme's utility classes.** \`.text-primary\` / \`.bg-primary\`
   are injected with \`!important\` into the LAST cascade layer, so no component
   rule can override them. Everything FusionUI ships is layered, which means your
   own unlayered CSS always wins — you rarely need \`!important\`.
4. **SSR-safe or it is broken.** Never touch \`window\`/\`document\` at module load;
   do it in \`onMounted\`. Wrap genuinely client-only content in \`<f-no-ssr>\`.
5. **Accessibility is not optional.** Interactive components need real keyboard
   support, and every animation needs a \`prefers-reduced-motion\` path.
6. \`createFusionUI()\` registers every component, so importing one component
   individually does NOT reduce the bundle today.

## Components

${components.length ? components.map(c => `\`${c}\``).join(', ') : '(see the docs)'}

## Common patterns

\`\`\`vue
<script setup>
import { ref } from 'vue'
import { useNotify, useTheme } from '@rukkiecodes/vue'
const open = ref(false)
const { notify } = useNotify()
const theme = useTheme()
</script>

<template>
  <f-btn color="primary" prepend-icon="zap" @click="open = true">Open</f-btn>
  <f-btn variant="text" :icon="theme.isDark.value ? 'sun' : 'moon'" @click="theme.toggle()" />

  <f-dialog v-model="open">
    <template #header><h4 style="margin:0">Welcome</h4></template>
    <f-input block placeholder="Email" prepend-icon="at-sign" />
    <template #footer>
      <f-btn variant="text" @click="open = false">Cancel</f-btn>
      <f-btn color="primary" @click="notify.success({ title: 'Saved' })">Save</f-btn>
    </template>
  </f-dialog>
</template>
\`\`\`

## Learn more

- Machine-readable index: ${SITE}/llms.txt
- Any page as markdown/JSON: append \`.md\` or \`.json\` to its URL (e.g. ${SITE}/components/dialog.md).
- Manifest of all pages: ${SITE}/ai/manifest.json
`
writeFileSync(join(dist, 'ai', 'fusionui-skill.md'), skill)

console.log(
  `AI docs: ${pages.length} pages → .md/.json, llms.txt, llms-full.txt, sitemap.xml, robots.txt, ai/skill+manifest`
)
