// Smoke test: scaffold every target into a temp dir and assert what landed.
// This drives the real CLI end to end — the only check that proves the flags,
// the template copy and the generators actually agree with one another.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const cli = join(here, '..', 'index.mjs')
const tmp = mkdtempSync(join(tmpdir(), 'fusionui-create-'))

let failures = 0
function assert(cond, msg) {
  if (!cond) {
    console.error(`  ✖ ${msg}`)
    failures++
  }
}

function scaffold(name, args) {
  const dir = join(tmp, name)
  execFileSync('node', [cli, dir, ...args, '-y', '--no-install'], { stdio: 'ignore' })
  return dir
}

const read = (dir, f) => readFileSync(join(dir, f), 'utf8')
const has = (dir, f) => existsSync(join(dir, f))

try {
  // ---- Vue SPA (TypeScript, default features) ------------------------------
  {
    const app = scaffold('spa', ['--target', 'vue-spa'])
    assert(has(app, 'src/main.ts'), 'spa: TypeScript entry')
    assert(has(app, 'src/router.ts'), 'spa: routed by definition')
    assert(has(app, 'src/pages/Home.vue'), 'spa: home page')
    assert(has(app, 'tsconfig.json'), 'spa: tsconfig')
    assert(has(app, '.gitignore'), 'spa: _gitignore -> .gitignore')
    const pkg = read(app, 'package.json')
    assert(pkg.includes('"name": "spa"'), 'spa: project name token replaced')
    assert(!pkg.includes('{{projectName}}'), 'spa: no leftover tokens')
    assert(pkg.includes('vue-router'), 'spa: vue-router dependency')
    assert(pkg.includes('vue-tsc'), 'spa: TypeScript tooling')
    assert(pkg.includes('pinia'), 'spa: pinia is a default feature')
    assert(read(app, 'src/main.ts').includes('.use(router)'), 'spa: router registered in entry')
    // The demo is full of legitimate `{{ count }}` interpolations, so only the
    // scaffold's own tokens are checked.
    const demo = read(app, 'src/Demo.vue')
    assert(!demo.includes('{{scriptLang}}'), 'spa: scriptLang token replaced')
    assert(demo.includes('<script setup lang="ts">'), 'spa: demo is TypeScript')
  }

  // ---- Vue PWA -------------------------------------------------------------
  {
    const app = scaffold('pwa', ['--target', 'vue-pwa'])
    const vite = read(app, 'vite.config.ts')
    assert(vite.includes('VitePWA'), 'pwa: VitePWA plugin wired')
    assert(vite.includes("name: 'pwa'"), 'pwa: manifest carries the project name')
    // The manifest points at this file; without it the app is not installable.
    assert(has(app, 'public/icon.svg'), 'pwa: the manifest icon exists')
    assert(read(app, 'package.json').includes('vite-plugin-pwa'), 'pwa: plugin dependency')
  }

  // ---- Static site (no router unless asked) --------------------------------
  {
    const app = scaffold('static', ['--target', 'vue-static', '--no-features'])
    assert(!has(app, 'src/router.ts'), 'static: no router by default')
    assert(!read(app, 'package.json').includes('vue-router'), 'static: no router dependency')
    assert(!read(app, 'package.json').includes('pinia'), 'static: --no-features drops the defaults')
    assert(read(app, 'src/App.vue').includes('Demo'), 'static: renders the demo directly')
  }

  // ---- Static site, routed on request --------------------------------------
  {
    const app = scaffold('static-routed', ['--target', 'vue-static', '--features', 'router'])
    assert(has(app, 'src/router.ts'), 'static+router: router file')
    assert(
      read(app, 'src/App.vue').includes('RouterView'),
      'static+router: shell renders RouterView'
    )
  }

  // ---- Nuxt ----------------------------------------------------------------
  {
    const app = scaffold('nuxt-app', ['--target', 'nuxt'])
    assert(has(app, 'nuxt.config.ts'), 'nuxt: config')
    assert(has(app, 'plugins/fusionui.ts'), 'nuxt: FusionUI plugin')
    assert(has(app, 'components/Demo.vue'), 'nuxt: demo is auto-imported from components/')
    assert(has(app, 'pages/index.vue'), 'nuxt: index page')
    const cfg = read(app, 'nuxt.config.ts')
    assert(cfg.includes("css: ['@rukkiecodes/vue/styles']"), 'nuxt: stylesheet registered')
    assert(cfg.includes('@pinia/nuxt'), 'nuxt: pinia registered as a module')
    // The module must be INSTALLED, not just referenced, or `nuxt build` dies
    // with "Could not load @pinia/nuxt".
    assert(read(app, 'package.json').includes('"@pinia/nuxt"'), 'nuxt: pinia module installed')
    assert(!has(app, 'vite.config.ts'), 'nuxt: no Vite config — Nuxt owns the build')
  }

  // ---- Expo ----------------------------------------------------------------
  {
    const app = scaffold('mobile', ['--target', 'expo'])
    assert(has(app, 'App.tsx'), 'expo: entry')
    assert(has(app, 'src/store.ts'), 'expo: zustand store (a default feature)')
    const pkg = read(app, 'package.json')
    assert(pkg.includes('zustand'), 'expo: zustand dependency')
    assert(!pkg.includes('"vue"'), 'expo: no Vue dependency')
    assert(
      read(app, 'tsconfig.json').includes('bundler'),
      'expo: bundler resolution, so @rukkiecodes/tokens/native typechecks'
    )
  }

  // ---- Features on demand --------------------------------------------------
  {
    const app = scaffold('featured', ['--target', 'vue-spa', '--features', 'vitest,eslint,i18n'])
    assert(has(app, 'vitest.config.ts'), 'features: vitest config')
    assert(has(app, 'src/__tests__/example.test.ts'), 'features: example test')
    assert(has(app, 'eslint.config.mjs'), 'features: eslint config')
    assert(has(app, 'src/i18n.ts'), 'features: i18n module')
    assert(read(app, 'src/main.ts').includes('.use(i18n)'), 'features: i18n registered in entry')
    assert(
      read(app, 'eslint.config.mjs').includes('multi-word-component-names'),
      'features: single-word page names do not fail lint on a fresh project'
    )
    // An explicit list replaces the defaults, so pinia is absent here.
    assert(!has(app, 'src/stores/counter.ts'), 'features: an explicit list replaces the defaults')
  }

  // ---- Legacy flags still work ---------------------------------------------
  {
    const app = scaffold('legacy-js', ['--template', 'default'])
    assert(has(app, 'src/main.js'), 'legacy: --template default is still JavaScript')
    assert(!has(app, 'src/main.ts'), 'legacy: no TS entry')
    const ts = scaffold('legacy-ts', ['--ts'])
    assert(has(ts, 'src/main.ts'), 'legacy: --ts still yields TypeScript')
  }

  if (failures) {
    console.error(`\n✖ create-fusionui smoke test: ${failures} failure(s)`)
    process.exit(1)
  }
  console.log('✔ create-fusionui smoke test passed (all targets)')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
