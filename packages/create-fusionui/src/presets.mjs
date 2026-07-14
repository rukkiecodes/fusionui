// The catalogue the `init` flow is built from: what you can scaffold (targets)
// and what you can bolt onto it (features).
//
// Targets × features would explode into dozens of templates if each combination
// were a folder on disk, so nothing here is a whole project. A target names a
// small base skeleton plus the shape of its entry file; a feature contributes
// dependencies, files, and lines to that entry. `scaffold.mjs` composes them.
//
// `kind` is what a feature keys off — 'vue' (Vite + Vue), 'nuxt', or 'expo' —
// so a feature declares "I work with Vue apps" rather than listing every target.

/** Pinned once, here, so every target agrees on a version. */
export const VERSIONS = {
  vue: '^3.5.34',
  vite: '^8.1.4',
  '@vitejs/plugin-vue': '^6.0.8',
  typescript: '^5.9.3',
  'vue-tsc': '^3.3.7',
  'vue-router': '^5.1.0',
  pinia: '^3.0.4',
  '@vueuse/core': '^14.3.0',
  'vue-i18n': '^11.4.6',
  'vite-plugin-pwa': '^1.3.0',
  vitest: '^4.1.10',
  '@vue/test-utils': '^2.4.11',
  jsdom: '^29.1.1',
  eslint: '^9.39.5',
  '@eslint/js': '^9.39.5',
  'eslint-plugin-vue': '^10.9.2',
  prettier: '^3.9.5',
  'eslint-config-prettier': '^10.1.8',
  nuxt: '^4.4.8',
  '@pinia/nuxt': '^0.11.3',
  zustand: '^5.0.14',
  // Pinned to the Expo SDK the template targets (52) — expo-router's major
  // tracks the SDK, so this is not a free-floating "latest".
  'expo-router': '~4.0.22',
  'react-native-safe-area-context': '4.12.0',
  'react-native-screens': '~4.4.0',
}

const FUSION = {
  '@rukkiecodes/vue': 'latest',
  '@rukkiecodes/icons': 'latest',
}

/**
 * What you can scaffold. `base` is the template folder; `kind` decides which
 * features apply and how the entry file is generated.
 */
export const TARGETS = [
  {
    id: 'vue-spa',
    title: 'Vue SPA',
    hint: 'Vite + Vue 3, client-rendered, with routing',
    kind: 'vue',
    base: 'vue',
    router: true,
    deps: { ...FUSION, vue: VERSIONS.vue },
    devDeps: {
      '@vitejs/plugin-vue': VERSIONS['@vitejs/plugin-vue'],
      vite: VERSIONS.vite,
    },
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  },
  {
    id: 'vue-pwa',
    title: 'Vue PWA',
    hint: 'The SPA, plus a service worker, manifest and offline support',
    kind: 'vue',
    base: 'vue',
    router: true,
    pwa: true,
    deps: { ...FUSION, vue: VERSIONS.vue },
    devDeps: {
      '@vitejs/plugin-vue': VERSIONS['@vitejs/plugin-vue'],
      vite: VERSIONS.vite,
      'vite-plugin-pwa': VERSIONS['vite-plugin-pwa'],
    },
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  },
  {
    id: 'vue-static',
    title: 'Static site',
    hint: 'Vite + Vue, no router — a landing page you can host anywhere',
    kind: 'vue',
    base: 'vue',
    router: false,
    deps: { ...FUSION, vue: VERSIONS.vue },
    devDeps: {
      '@vitejs/plugin-vue': VERSIONS['@vitejs/plugin-vue'],
      vite: VERSIONS.vite,
    },
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  },
  {
    id: 'nuxt',
    title: 'Nuxt',
    hint: 'Server-rendered or statically generated, file-based routing',
    kind: 'nuxt',
    base: 'nuxt',
    // Nuxt brings its own router, so `router` is never offered as a feature.
    router: true,
    deps: { ...FUSION, vue: VERSIONS.vue },
    devDeps: { nuxt: VERSIONS.nuxt },
    scripts: {
      dev: 'nuxt dev',
      build: 'nuxt build',
      generate: 'nuxt generate',
      preview: 'nuxt preview',
      postinstall: 'nuxt prepare',
    },
  },
  {
    id: 'expo',
    title: 'Expo (mobile)',
    hint: 'React Native for iOS and Android, with Skia',
    kind: 'expo',
    base: 'expo',
    deps: {
      '@rukkiecodes/native': 'latest',
      '@rukkiecodes/tokens': 'latest',
      '@shopify/react-native-skia': '^1.5.0',
      expo: '~52.0.0',
      'expo-linear-gradient': '~14.0.0',
      'expo-status-bar': '~2.0.0',
      react: '18.3.1',
      'react-native': '0.76.5',
      'react-native-reanimated': '~3.16.0',
    },
    devDeps: { '@types/react': '~18.3.0', typescript: VERSIONS.typescript },
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
    },
  },
]

/**
 * Optional extras. `kinds` gates which targets may offer a feature; `default`
 * preselects it in the prompt. Each feature contributes some of:
 *   deps / devDeps      — merged into package.json
 *   scripts             — merged into package.json
 *   vue { imports, setup, use }  — lines woven into the generated entry file
 *   nuxt { modules }    — pushed into nuxt.config
 *   files(ctx)          — { path: contents } written into the project
 */
export const FEATURES = [
  {
    id: 'router',
    title: 'Vue Router',
    hint: 'Client-side routing',
    kinds: ['vue'],
    // The SPA and PWA are routed by definition; only the static site chooses.
    appliesTo: t => t.kind === 'vue' && !t.router,
    default: false,
    deps: () => ({ 'vue-router': VERSIONS['vue-router'] }),
  },
  {
    id: 'pinia',
    title: 'Pinia',
    hint: 'State management (the official Vue store)',
    kinds: ['vue', 'nuxt'],
    default: true,
    deps: () => ({ pinia: VERSIONS.pinia }),
    // Nuxt wires Pinia in through a module, which nuxt.config references by name —
    // shipping `pinia` alone would leave that reference dangling and the build
    // would die with "Could not load @pinia/nuxt".
    devDeps: ctx => (ctx.target.kind === 'nuxt' ? { '@pinia/nuxt': VERSIONS['@pinia/nuxt'] } : {}),
  },
  {
    id: 'vueuse',
    title: 'VueUse',
    hint: 'A large collection of composition utilities',
    kinds: ['vue', 'nuxt'],
    default: false,
    deps: () => ({ '@vueuse/core': VERSIONS['@vueuse/core'] }),
  },
  {
    id: 'i18n',
    title: 'Vue I18n',
    hint: 'Internationalisation',
    kinds: ['vue'],
    default: false,
    deps: () => ({ 'vue-i18n': VERSIONS['vue-i18n'] }),
  },
  {
    id: 'state',
    title: 'Zustand',
    hint: 'State management',
    kinds: ['expo'],
    default: true,
    deps: () => ({ zustand: VERSIONS.zustand }),
  },
  {
    id: 'expo-router',
    title: 'Expo Router',
    hint: 'File-based navigation',
    kinds: ['expo'],
    default: false,
    deps: () => ({
      'expo-router': VERSIONS['expo-router'],
      'react-native-safe-area-context': VERSIONS['react-native-safe-area-context'],
      'react-native-screens': VERSIONS['react-native-screens'],
    }),
  },
  {
    id: 'vitest',
    title: 'Vitest',
    hint: 'Unit testing, with Vue Test Utils',
    kinds: ['vue', 'nuxt'],
    default: false,
    devDeps: () => ({
      vitest: VERSIONS.vitest,
      '@vue/test-utils': VERSIONS['@vue/test-utils'],
      jsdom: VERSIONS.jsdom,
    }),
    scripts: () => ({ test: 'vitest run', 'test:watch': 'vitest' }),
  },
  {
    id: 'eslint',
    title: 'ESLint + Prettier',
    hint: 'Linting and formatting',
    kinds: ['vue', 'nuxt', 'expo'],
    default: false,
    devDeps: ctx => ({
      eslint: VERSIONS.eslint,
      '@eslint/js': VERSIONS['@eslint/js'],
      // eslint-plugin-vue is pointless in an Expo project — it lints React there.
      ...(ctx.target.kind === 'expo' ? {} : { 'eslint-plugin-vue': VERSIONS['eslint-plugin-vue'] }),
      'eslint-config-prettier': VERSIONS['eslint-config-prettier'],
      prettier: VERSIONS.prettier,
    }),
    scripts: () => ({ lint: 'eslint .', format: 'prettier --write .' }),
  },
]

export function targetById(id) {
  return TARGETS.find(t => t.id === id)
}

/** The features a given target may offer, in catalogue order. */
export function featuresFor(target) {
  return FEATURES.filter(f => {
    if (!f.kinds.includes(target.kind)) return false
    return f.appliesTo ? f.appliesTo(target) : true
  })
}

/** ESLint is Vue-only in the web scaffolds; Expo lints React instead. */
export function isRouted(target, features) {
  return !!target.router || features.includes('router')
}
