#!/usr/bin/env node
// Generates component API JSON for the docs by loading the library SOURCE via
// Vite SSR and introspecting the runtime `make*Props` factories (which already
// have composable spreads merged) plus each component's `emits`.
//
//   node src/index.mjs   (pnpm --filter @vue-dl/api-generator generate)
//
// Output: apps/docs/src/api/<Component>.json  — globbed by docs ApiTable.vue.

import { createServer } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'

const here = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(here, '..')
const repoRoot = join(pkgRoot, '..', '..')
const libEntry = join(repoRoot, 'packages', 'vue-dl', 'src', 'index.ts')
const outDir = join(repoRoot, 'apps', 'docs', 'src', 'api')
const descDir = join(pkgRoot, 'descriptions')

function typeName(t) {
  if (t == null) return 'any'
  if (Array.isArray(t)) return t.map(typeName).join(' | ')
  if (typeof t === 'function') return t.name || 'any'
  return String(t)
}

function formatDefault(d) {
  if (d === undefined) return undefined
  if (typeof d === 'function') {
    try {
      return JSON.stringify(d())
    } catch {
      return undefined
    }
  }
  if (typeof d === 'object') return JSON.stringify(d)
  return String(d)
}

const server = await createServer({
  configFile: false,
  // Root at this package so `vue` resolves (it's a direct dep here); the library
  // is pulled in via the alias below.
  root: pkgRoot,
  logLevel: 'warn',
  plugins: [vueJsx()],
  resolve: {
    alias: [{ find: /^vue-dl$/, replacement: libEntry }],
    dedupe: ['vue'],
  },
  // The icons package ships TS source, so Vite must transpile it (not Node).
  ssr: { noExternal: ['@vue-dl/icons-feather'] },
})

try {
  const mod = await server.ssrLoadModule('vue-dl')
  const components = mod.components ?? {}
  mkdirSync(outDir, { recursive: true })

  let count = 0
  for (const [name, comp] of Object.entries(components)) {
    const factory = mod[`make${name}Props`]
    const props = {}
    if (typeof factory === 'function') {
      const defs = factory()
      for (const [propName, raw] of Object.entries(defs)) {
        const def = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : { type: raw }
        props[propName] = {
          type: typeName(def.type),
          default: formatDefault(def.default),
          required: !!def.required,
          description: '',
        }
      }
    }

    const events = {}
    const emits = comp?.emits
    if (emits) {
      const names = Array.isArray(emits) ? emits : Object.keys(emits)
      for (const e of names) events[e] = { description: '' }
    }

    // Optional hand-authored prose overlay.
    const descFile = join(descDir, `${name}.json`)
    if (existsSync(descFile)) {
      const desc = JSON.parse(readFileSync(descFile, 'utf8'))
      for (const [p, text] of Object.entries(desc.props ?? {})) {
        if (props[p]) props[p].description = text
      }
      for (const [e, text] of Object.entries(desc.events ?? {})) {
        if (events[e]) events[e].description = text
      }
    }

    writeFileSync(
      join(outDir, `${name}.json`),
      JSON.stringify({ displayName: name, props, events }, null, 2) + '\n'
    )
    count++
  }
  console.log(`Generated API JSON for ${count} components → apps/docs/src/api/`)
} finally {
  await server.close()
}
