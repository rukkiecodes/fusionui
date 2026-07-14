import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TARGETS, featuresFor, targetById } from '../src/presets.mjs'
import {
  buildPackageJson,
  createContext,
  demoPath,
  genNuxtConfig,
  genVueEntry,
  genViteConfig,
  generatedFiles,
} from '../src/scaffold.mjs'

const ctxFor = (targetId, features = [], typescript = true) =>
  createContext({
    target: targetById(targetId),
    features,
    projectName: 'demo-app',
    typescript,
  })

test('every target advertises a base template and a kind', () => {
  for (const t of TARGETS) {
    assert.ok(t.id && t.title && t.hint, `${t.id}: presentable in the prompt`)
    assert.ok(['vue', 'nuxt', 'expo'].includes(t.kind), `${t.id}: known kind`)
    assert.ok(t.base, `${t.id}: names a base template`)
  }
})

test('a feature is only offered to targets that can use it', () => {
  const expo = featuresFor(targetById('expo')).map(f => f.id)
  assert.ok(expo.includes('state'), 'expo offers Zustand')
  assert.ok(!expo.includes('pinia'), 'expo does not offer Pinia')

  const spa = featuresFor(targetById('vue-spa')).map(f => f.id)
  assert.ok(spa.includes('pinia'), 'the SPA offers Pinia')
  assert.ok(!spa.includes('state'), 'the SPA does not offer Zustand')
  // The SPA is routed by definition, so a router toggle would be a lie.
  assert.ok(!spa.includes('router'), 'the SPA does not offer a router choice')

  const staticSite = featuresFor(targetById('vue-static')).map(f => f.id)
  assert.ok(staticSite.includes('router'), 'the static site may opt into a router')
})

test('createContext drops features the target cannot support', () => {
  // Someone passing `--features state` to a Vue app should not get a Zustand app.
  const ctx = ctxFor('vue-spa', ['pinia', 'state'])
  assert.deepEqual(ctx.features, ['pinia'])
})

test('the SPA is routed and the static site is not, unless asked', () => {
  assert.equal(ctxFor('vue-spa').routed, true)
  assert.equal(ctxFor('vue-static').routed, false)
  assert.equal(ctxFor('vue-static', ['router']).routed, true)
})

test('buildPackageJson merges the target with the chosen features', () => {
  const pkg = JSON.parse(buildPackageJson(ctxFor('vue-spa', ['pinia', 'vitest'])))

  assert.equal(pkg.name, 'demo-app')
  assert.ok(pkg.dependencies['@rukkiecodes/vue'], 'FusionUI is always a dependency')
  assert.ok(pkg.dependencies['vue-router'], 'a routed target gets the router')
  assert.ok(pkg.dependencies.pinia, 'the picked feature contributes its dependency')
  assert.ok(pkg.devDependencies.vitest, 'and its devDependency')
  assert.equal(pkg.scripts.test, 'vitest run', 'and its script')
  assert.ok(pkg.devDependencies['vue-tsc'], 'TypeScript brings vue-tsc')
  assert.match(pkg.scripts.build, /vue-tsc/, 'the build type-checks first')
})

test('the JavaScript flavour carries no TypeScript tooling', () => {
  const pkg = JSON.parse(buildPackageJson(ctxFor('vue-spa', [], false)))
  assert.ok(!pkg.devDependencies.typescript)
  assert.ok(!pkg.devDependencies['vue-tsc'])
  assert.equal(pkg.scripts.build, 'vite build')
})

test('Nuxt installs the Pinia MODULE, not just Pinia', () => {
  // nuxt.config references '@pinia/nuxt' by name; if it is not installed the
  // build fails with "Could not load @pinia/nuxt".
  const ctx = ctxFor('nuxt', ['pinia'])
  const pkg = JSON.parse(buildPackageJson(ctx))
  assert.ok(pkg.devDependencies['@pinia/nuxt'], 'the module is installed')
  assert.match(genNuxtConfig(ctx), /@pinia\/nuxt/, 'and registered')
})

test('genVueEntry registers exactly what was picked, in order', () => {
  const entry = genVueEntry(ctxFor('vue-spa', ['pinia', 'i18n']))
  assert.match(entry, /createApp\(App\)/)
  assert.match(entry, /\.use\(fusionui\)/)
  assert.match(entry, /\.use\(router\)/)
  assert.match(entry, /\.use\(createPinia\(\)\)/)
  assert.match(entry, /\.use\(i18n\)/)
  assert.match(entry, /\.mount\('#app'\)/)

  const bare = genVueEntry(ctxFor('vue-static', []))
  assert.ok(!bare.includes('.use(router)'), 'an unrouted app never imports a router')
  assert.ok(!bare.includes('pinia'), 'and never imports a store it did not ask for')
})

test('genViteConfig only adds the PWA plugin to the PWA target', () => {
  assert.ok(!genViteConfig(ctxFor('vue-spa')).includes('VitePWA'))
  const pwa = genViteConfig(ctxFor('vue-pwa'))
  assert.match(pwa, /VitePWA\(/)
  assert.match(pwa, /name: 'demo-app'/, 'the manifest is named after the project')
  assert.match(pwa, /icon\.svg/, 'and points at an icon that is actually scaffolded')
})

test('generatedFiles puts the demo where each target expects it', () => {
  assert.equal(demoPath(ctxFor('vue-spa')), 'src/Demo.vue')
  // Nuxt auto-imports components/, so it goes there instead.
  assert.equal(demoPath(ctxFor('nuxt')), 'components/Demo.vue')
  assert.equal(demoPath(ctxFor('expo')), null)
})

test('generatedFiles writes only the files the choices imply', () => {
  const spa = Object.keys(generatedFiles(ctxFor('vue-spa', ['pinia'])))
  assert.ok(spa.includes('src/main.ts'))
  assert.ok(spa.includes('src/router.ts'))
  assert.ok(spa.includes('src/stores/counter.ts'))
  assert.ok(!spa.includes('src/i18n.ts'), 'no i18n module without the i18n feature')
  assert.ok(!spa.includes('eslint.config.mjs'), 'no lint config without the eslint feature')

  const nuxt = Object.keys(generatedFiles(ctxFor('nuxt')))
  assert.ok(nuxt.includes('nuxt.config.ts'))
  assert.ok(nuxt.includes('plugins/fusionui.ts'))
  assert.ok(!nuxt.some(f => f.startsWith('vite.config')), 'Nuxt owns its own build')

  const expo = Object.keys(generatedFiles(ctxFor('expo', ['state'])))
  assert.ok(expo.includes('src/store.ts'))
  assert.ok(!expo.some(f => f.includes('main.')), 'Expo has no Vue entry')
})
