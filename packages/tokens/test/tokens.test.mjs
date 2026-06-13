// Regression guards for the generated token outputs. `pnpm test` runs build.mjs
// first, so these assert the freshly generated dist/ is correct and web-ism-free.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const dist = p => join(ROOT, '..', 'dist', p)
const web = await import(pathToFileURL(dist('ts/index.js')).href)
const native = await import(pathToFileURL(dist('native/index.js')).href)
const css = readFileSync(dist('css/tokens.css'), 'utf8')
const scss = readFileSync(dist('scss/_tokens.scss'), 'utf8')

test('web: core token values', () => {
  assert.equal(web.radius.md, '12px')
  assert.equal(web.radius.lg, '20px')
  assert.equal(web.shadows['3'], '0 5px 20px 0 rgba(0, 0, 0, 0.05)')
  assert.equal(web.motion.duration.base, '0.25s')
  assert.equal(web.themes.light.colors.primary, '#195bff')
  assert.equal(web.themes.dark.colors.surface, '#26282c')
})

test('css: emits the names components depend on, with the primary triplet', () => {
  for (const name of [
    '--fui-radius-md',
    '--fui-transition',
    '--fui-transition-duration',
    '--fui-font-family',
    '--fui-spacer',
    '--fui-theme-primary',
    '--fui-border-color',
    '--fui-surface-2',
  ]) {
    assert.ok(css.includes(name), `tokens.css missing ${name}`)
  }
  assert.match(css, /--fui-theme-primary:\s*25,91,255;/)
  assert.ok(css.includes('.fui-theme--dark'), 'tokens.css missing dark scope')
})

test('scss: shadow ramp + radius match the legacy values', () => {
  assert.match(scss, /\$fui-radius-md:\s*12px\s*!default;/)
  assert.match(scss, /1:\s*0 2px 8px 0 rgba\(0, 0, 0, 0\.04\)/)
  assert.match(scss, /24:\s*0 26px 66px 0 rgba\(0, 0, 0, 0\.3\)/)
})

test('native: no web-isms (no px, no CSS color/shadow strings)', () => {
  const src = readFileSync(dist('native/index.js'), 'utf8')
  assert.ok(!/\dpx/.test(src), 'native output contains a px dimension')
  assert.ok(!src.includes('rgba('), 'native output contains a CSS rgba string')
  assert.ok(!src.includes('box-shadow'), 'native output contains a box-shadow string')
})

test('native: durations are milliseconds, dimensions are numbers', () => {
  assert.equal(native.motion.duration.base, 250)
  assert.equal(native.motion.duration.fast, 150)
  assert.equal(native.radius.md, 12)
  assert.equal(native.radius.circle, 9999)
  assert.equal(typeof native.breakpoint.md, 'number')
})

test('native: shadows are structured numeric objects', () => {
  const s = native.shadows['3']
  assert.equal(typeof s.offsetY, 'number')
  assert.equal(typeof s.blur, 'number')
  assert.equal(typeof s.opacity, 'number')
  assert.equal(s.color, '#000000')
})
