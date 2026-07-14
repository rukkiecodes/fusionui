// Composes a project from one target + any number of features.
//
// Nothing here writes a whole project verbatim: the base template holds only the
// files that never vary, and everything a feature can influence (package.json,
// the app entry, the build config) is GENERATED. That is what keeps the number of
// templates at one-per-target instead of one-per-combination.
//
// The generators are pure — they take a context and return a string — so the
// tests can assert on the output without touching the filesystem.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { featuresFor, isRouted, VERSIONS } from './presets.mjs'

/** The context every generator reads. */
export function createContext({ target, features, projectName, typescript }) {
  const allowed = featuresFor(target).map(f => f.id)
  // Never let a flag smuggle in a feature the target can't support.
  const picked = features.filter(f => allowed.includes(f))
  return {
    target,
    projectName,
    typescript,
    features: picked,
    has: id => picked.includes(id),
    routed: isRouted(target, picked),
    ext: typescript ? 'ts' : 'js',
    lang: typescript ? ' lang="ts"' : '',
  }
}

function sortObject(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

/** Merges the target's manifest with every selected feature's contribution. */
export function buildPackageJson(ctx) {
  const { target } = ctx
  let deps = { ...target.deps }
  let devDeps = { ...target.devDeps }
  let scripts = { ...target.scripts }

  // The static site only gains a router if it asked for one.
  if (ctx.routed && target.kind === 'vue') {
    deps['vue-router'] = VERSIONS['vue-router']
  }

  for (const feature of featuresFor(target)) {
    if (!ctx.has(feature.id)) continue
    Object.assign(deps, feature.deps?.(ctx) ?? {})
    Object.assign(devDeps, feature.devDeps?.(ctx) ?? {})
    Object.assign(scripts, feature.scripts?.(ctx) ?? {})
  }

  if (ctx.typescript && target.kind === 'vue') {
    devDeps.typescript = VERSIONS.typescript
    devDeps['vue-tsc'] = VERSIONS['vue-tsc']
    // `--noEmit` rather than `-b`: build mode wants a composite project, and a
    // type-check is all we want before handing over to Vite.
    scripts.build = 'vue-tsc --noEmit && vite build'
  }
  if (ctx.typescript && target.kind === 'nuxt') {
    devDeps.typescript = VERSIONS.typescript
    scripts.typecheck = 'nuxt typecheck'
  }

  const pkg = {
    name: ctx.projectName,
    private: true,
    version: '0.0.0',
    ...(target.kind === 'expo' ? { main: 'expo/AppEntry.js' } : { type: 'module' }),
    scripts: sortObject(scripts),
    dependencies: sortObject(deps),
    devDependencies: sortObject(devDeps),
  }

  // Expo Router replaces the classic single-entry App.tsx.
  if (target.kind === 'expo' && ctx.has('expo-router')) {
    pkg.main = 'expo-router/entry'
  }

  return JSON.stringify(pkg, null, 2) + '\n'
}

// ---------------------------------------------------------------- vue entry

/** The `src/main.{ts,js}` for a Vite + Vue app: FusionUI plus whatever was picked. */
export function genVueEntry(ctx) {
  const imports = [
    "import { createApp } from 'vue'",
    "import { createFusionUI } from '@rukkiecodes/vue'",
    "import { fusionSet, fusionAliases } from '@rukkiecodes/icons'",
    "import '@rukkiecodes/vue/styles'",
    "import App from './App.vue'",
  ]
  const uses = ['fusionui']

  if (ctx.routed) {
    imports.push("import { router } from './router'")
    uses.push('router')
  }
  if (ctx.has('pinia')) {
    imports.push("import { createPinia } from 'pinia'")
    uses.push('createPinia()')
  }
  if (ctx.has('i18n')) {
    imports.push("import { i18n } from './i18n'")
    uses.push('i18n')
  }

  const chain = uses.map(u => `  .use(${u})`).join('\n')

  return `${imports.join('\n')}

// Start in whatever theme the operating system is set to, and keep following it.
// Guarded for SSR/prerender, where there is no window to ask.
const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const fusionui = createFusionUI({
  theme: { defaultTheme: media?.matches ? 'dark' : 'light' },
  icons: {
    defaultSet: 'fusion',
    sets: { fusion: fusionSet },
    aliases: fusionAliases,
  },
})

// The user's own toggle still wins for the rest of the session — this only
// reacts to the OS switching underneath them.
media?.addEventListener('change', e => fusionui.theme.change(e.matches ? 'dark' : 'light'))

createApp(App)
${chain}
  .mount('#app')
`
}

export function genViteConfig(ctx) {
  const imports = ["import { defineConfig } from 'vite'", "import vue from '@vitejs/plugin-vue'"]
  const plugins = ['vue()']

  if (ctx.target.pwa) {
    imports.push("import { VitePWA } from 'vite-plugin-pwa'")
    plugins.push(`VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '${ctx.projectName}',
        short_name: '${ctx.projectName}',
        description: 'Built with FusionUI',
        theme_color: '#195bff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    })`)
  }

  return `${imports.join('\n')}

export default defineConfig({
  plugins: [${plugins.length > 1 ? `\n    ${plugins.join(',\n    ')},\n  ` : plugins[0]}],
})
`
}

export function genTsConfig() {
  return (
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          jsx: 'preserve',
          strict: true,
          skipLibCheck: true,
          isolatedModules: true,
          noEmit: true,
          types: ['vite/client'],
        },
        include: ['src', 'vite.config.ts'],
      },
      null,
      2
    ) + '\n'
  )
}

// ---------------------------------------------------------------- nuxt

export function genNuxtConfig(ctx) {
  const modules = []
  if (ctx.has('pinia')) modules.push("'@pinia/nuxt'")

  return `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // FusionUI ships a prebuilt stylesheet; the plugin in plugins/ installs the
  // components and the theme.
  css: ['@rukkiecodes/vue/styles'],${modules.length ? `\n\n  modules: [${modules.join(', ')}],` : ''}
})
`
}

export function genNuxtPlugin() {
  return `import { createFusionUI } from '@rukkiecodes/vue'
import { fusionSet, fusionAliases } from '@rukkiecodes/icons'

// Nuxt renders on the server first, so FusionUI is installed onto the Vue app
// Nuxt already created rather than one we create ourselves.
export default defineNuxtPlugin(nuxtApp => {
  // Start in the operating system's theme. There is no window on the server, so
  // it renders light and switches on the client — the theme is applied as CSS
  // variables and a class on <html>, neither of which Vue hydrates, so this
  // cannot cause a hydration mismatch.
  const media = import.meta.client ? window.matchMedia('(prefers-color-scheme: dark)') : null

  const fusionui = createFusionUI({
    theme: { defaultTheme: media?.matches ? 'dark' : 'light' },
    icons: {
      defaultSet: 'fusion',
      sets: { fusion: fusionSet },
      aliases: fusionAliases,
    },
  })

  media?.addEventListener('change', e => fusionui.theme.change(e.matches ? 'dark' : 'light'))

  nuxtApp.vueApp.use(fusionui)
})
`
}

// ---------------------------------------------------------------- feature files

function routerFile() {
  return `import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    // Lazily loaded, so the About page is its own chunk.
    { path: '/about', name: 'about', component: () => import('./pages/About.vue') },
  ],
})
`
}

function homePage(ctx) {
  return `<script setup${ctx.lang}>
import Demo from '../Demo.vue'
</script>

<template>
  <Demo />
</template>
`
}

function aboutPage() {
  return `<template>
  <f-container class="page">
    <h1>About</h1>
    <p>A second route, so you can see the router working.</p>

    <!-- FBtn renders an anchor when given href; RouterLink supplies one and
         keeps the navigation client-side. -->
    <RouterLink v-slot="{ href, navigate }" to="/" custom>
      <f-btn variant="tonal" prepend-icon="arrow-left" :href="href" @click="navigate">
        Back home
      </f-btn>
    </RouterLink>
  </f-container>
</template>

<style scoped>
.page {
  padding: 48px 24px;
}
</style>
`
}

function appShell(ctx) {
  if (!ctx.routed) {
    return `<script setup${ctx.lang}>
import Demo from './Demo.vue'
</script>

<template>
  <Demo />
</template>
`
  }
  return `<template>
  <RouterView />
</template>
`
}

function piniaStore() {
  return `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
})
`
}

function i18nFile() {
  return `import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { welcome: 'Welcome to {name}' },
    fr: { welcome: 'Bienvenue sur {name}' },
  },
})
`
}

function zustandStore() {
  return `import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
}

export const useCounter = create<CounterState>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}))
`
}

function eslintConfig(ctx) {
  if (ctx.target.kind === 'expo') {
    return `import js from '@eslint/js'
import prettier from 'eslint-config-prettier'

export default [js.configs.recommended, prettier, { ignores: ['node_modules', '.expo', 'dist'] }]
`
  }
  return `import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    rules: {
      // Pages and views are legitimately single-word (Home, About, Settings).
      // Left on, this rule fails \`npm run lint\` on a freshly scaffolded project.
      'vue/multi-word-component-names': 'off',
    },
  },
  { ignores: ['node_modules', 'dist', '.nuxt', '.output'] },
]
`
}

function vitestConfig() {
  return `import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: { environment: 'jsdom' },
})
`
}

function exampleTest() {
  return `import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createFusionUI, FBtn } from '@rukkiecodes/vue'

describe('FusionUI', () => {
  it('mounts a button', () => {
    const wrapper = mount(FBtn, {
      props: { color: 'primary' },
      slots: { default: 'Go' },
      global: { plugins: [createFusionUI()] },
    })
    expect(wrapper.text()).toContain('Go')
  })
})
`
}

function pwaIcon() {
  // A plain, honest placeholder — the README tells you to replace it. Shipping a
  // manifest that points at a file that isn't there would break installability.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="App icon">
  <rect width="512" height="512" rx="112" fill="#195bff" />
  <path
    d="M188 132h150v46h-104v52h94v46h-94v104h-46z"
    fill="#fff"
  />
</svg>
`
}

/** Where each target wants the shared showcase component to land. */
export function demoPath(ctx) {
  if (ctx.target.kind === 'nuxt') return 'components/Demo.vue'
  if (ctx.target.kind === 'vue') return 'src/Demo.vue'
  return null
}

function readme(ctx) {
  const { target } = ctx
  const picked = ctx.features.length
    ? ctx.features.map(f => `- \`${f}\``).join('\n')
    : '_None — add them yourself whenever you need them._'

  const run =
    target.kind === 'expo'
      ? 'npm run start'
      : target.kind === 'nuxt'
        ? 'npm run dev'
        : 'npm run dev'

  return `# ${ctx.projectName}

Built with [FusionUI](https://rukkiecodes.github.io/fusionui/) — **${target.title}** (${target.hint}).

## Run it

\`\`\`sh
npm install
${run}
\`\`\`

## What's included

${picked}
${
  target.pwa
    ? `
## PWA

The service worker and manifest come from \`vite-plugin-pwa\`. The manifest points
at \`public/icon.svg\` — a placeholder. **Replace it with your own icon** before you
ship, and check the result with Lighthouse.

The service worker only registers in a production build, so test it with
\`npm run build && npm run preview\`, not \`npm run dev\`.
`
    : ''
}
## Working with FusionUI

\`\`\`sh
npx fusionui add f-glass       # add a component (--copy to vendor its source)
npx fusionui theme brand --primary=#195bff
\`\`\`

Docs: https://rukkiecodes.github.io/fusionui/
`
}

/** Every generated (non-base-template) file, as `{ relativePath: contents }`. */
export function generatedFiles(ctx) {
  const { target, ext } = ctx
  const files = { 'package.json': buildPackageJson(ctx), 'README.md': readme(ctx) }

  if (target.kind === 'vue') {
    files[`src/main.${ext}`] = genVueEntry(ctx)
    files[`vite.config.${ext}`] = genViteConfig(ctx)
    files['src/App.vue'] = appShell(ctx)
    if (ctx.typescript) {
      files['tsconfig.json'] = genTsConfig()
      files['src/vite-env.d.ts'] = `/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
`
    }

    if (ctx.routed) {
      files[`src/router.${ext}`] = routerFile(ctx)
      files['src/pages/Home.vue'] = homePage(ctx)
      files['src/pages/About.vue'] = aboutPage(ctx)
    }
    if (ctx.has('pinia')) files[`src/stores/counter.${ext}`] = piniaStore(ctx)
    if (ctx.has('i18n')) files[`src/i18n.${ext}`] = i18nFile(ctx)
    if (target.pwa) files['public/icon.svg'] = pwaIcon()
    if (ctx.has('vitest')) {
      files[`vitest.config.${ext}`] = vitestConfig(ctx)
      files[`src/__tests__/example.test.${ext}`] = exampleTest(ctx)
    }
  }

  if (target.kind === 'nuxt') {
    files['nuxt.config.ts'] = genNuxtConfig(ctx)
    files['plugins/fusionui.ts'] = genNuxtPlugin()
    if (ctx.has('pinia')) files['stores/counter.ts'] = piniaStore(ctx)
  }

  if (target.kind === 'expo' && ctx.has('state')) {
    files['src/store.ts'] = zustandStore()
  }

  if (ctx.has('eslint')) {
    files['eslint.config.mjs'] = eslintConfig(ctx)
    files['.prettierrc.json'] = JSON.stringify(
      { semi: false, singleQuote: true, printWidth: 100, arrowParens: 'avoid' },
      null,
      2
    )
  }

  return files
}

/** Writes the generated files under `root`, creating directories as needed. */
export function writeFiles(root, files) {
  for (const [rel, contents] of Object.entries(files)) {
    const dest = join(root, rel)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, contents)
  }
}
