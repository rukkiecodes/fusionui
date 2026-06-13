import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { genThemeFile } from '../src/theme.mjs'
import { toComponentName, findVueSrc, collectGraph, copyIn } from '../src/add.mjs'

test('genThemeFile emits a wireable token-override module', () => {
  const out = genThemeFile(
    { primary: '#195bff', success: '#46c93a' },
    { name: 'acme', typescript: true }
  )
  assert.match(out, /export const acmeLight: ThemeDefinition/)
  assert.match(out, /export const acmeDark: ThemeDefinition/)
  assert.match(out, /primary: '#195bff'/)
  assert.match(out, /success: '#46c93a'/)
  // JS flavour drops the type import + annotation.
  const js = genThemeFile({ primary: '#000000' }, { name: 'brand', typescript: false })
  assert.ok(!js.includes('ThemeDefinition'))
  assert.match(js, /export const brandLight = \{/)
})

test('toComponentName maps kebab + F-prefixed names to the component dir', () => {
  assert.equal(toComponentName('f-glass'), 'FGlass')
  assert.equal(toComponentName('f-line-chart'), 'FLineChart')
  assert.equal(toComponentName('f-btn'), 'FBtn')
  assert.equal(toComponentName('FGlass'), 'FGlass')
})

test('add --copy vendors the component graph with no @fusionui/vue import left', () => {
  const srcRoot = findVueSrc()
  assert.ok(srcRoot, 'should locate @fusionui/vue src in the monorepo')

  // The graph walk reaches the component, its composable and the glass engine.
  const entry = join(srcRoot, 'components', 'FGlass', 'index.ts')
  const graph = collectGraph(entry)
  const rels = [...graph].map(f => f.replace(srcRoot, '').replace(/\\/g, '/'))
  assert.ok(rels.some(r => r.includes('/components/FGlass/FGlass.tsx')))
  assert.ok(rels.some(r => r.includes('/composables/liquidGlass.ts')))
  assert.ok(rels.some(r => r.includes('/engine/liquid-glass/refraction.ts')))

  const dest = mkdtempSync(join(tmpdir(), 'fui-copy-'))
  try {
    const written = copyIn('FGlass', srcRoot, join(dest, 'src'))
    assert.ok(written.length > 5, 'vendors several files')
    // Structure mirrored under src/fusionui.
    assert.ok(existsSync(join(dest, 'src', 'fusionui', 'components', 'FGlass', 'FGlass.tsx')))
    assert.ok(existsSync(join(dest, 'src', 'fusionui', 'components', 'FGlass', 'FGlass.scss')))
    assert.ok(existsSync(join(dest, 'src', 'fusionui', 'composables', 'liquidGlass.ts')))

    // Acceptance: no `@fusionui/vue` import remains anywhere in the copy-in.
    const walk = dir =>
      readdirSync(dir).flatMap(e => {
        const p = join(dir, e)
        return statSync(p).isDirectory() ? walk(p) : [p]
      })
    for (const f of walk(join(dest, 'src', 'fusionui'))) {
      if (!/\.(ts|tsx)$/.test(f)) continue
      assert.ok(
        !readFileSync(f, 'utf8').includes("from '@fusionui/vue'"),
        `${f} still imports @fusionui/vue`
      )
    }
    // Header stamped on vendored TS.
    const head = readFileSync(
      join(dest, 'src', 'fusionui', 'components', 'FGlass', 'FGlass.tsx'),
      'utf8'
    )
    assert.match(head, /Vendored from @fusionui\/vue/)
  } finally {
    rmSync(dest, { recursive: true, force: true })
  }
})
