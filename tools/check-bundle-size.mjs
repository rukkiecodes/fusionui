#!/usr/bin/env node
// Performance budgets — track the gzipped size of each shipped bundle and fail
// if any exceeds its ceiling. Dependency-free (node's zlib). Run after `build`.
//
//   node tools/check-bundle-size.mjs
import { gzipSync } from 'node:zlib'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// gzip-kB ceilings on the FULL barrel bundle. Apps tree-shake what they don't
// import, so a button-only app ships a fraction of this — these budgets exist
// to catch *regressions*, not to bound a real app's payload. Tighten as the
// library is optimised; never loosen silently (a bump needs a reason in review).
// Bumped (2026-06-15): the full barrel grew with the Vuesax-parity component
// additions (Avatar, Tooltip, Dialog, Select, Radio, Switch, Checkbox, OTP,
// Loading, Navbar, Sidebar, …). Tree-shaking means real apps still ship a
// fraction; these ceilings track the full-barrel worst case for regressions.
// Bumped (2026-07-07): the barrel grew again — the landing/app-shell + layout
// primitives (FLayout/FMain/FHero/FSection/FAuthLayout/…), FImage/FCarousel,
// and the responsive layout grid (FContainer/FRow/FCol, which emits the full
// span/offset/order/align utility surface across 6 breakpoints). Tree-shaking
// means real apps still ship a fraction; these track the full-barrel worst case.
// Bumped again (2026-07-07): the responsive flexbox utility layer (styles/
// utilities/_flex.scss — d-*/flex-*/justify-*/align-*/order-*/gap-* × 6
// breakpoints, Vuetify-parity) adds ~3 kB gz of global helper CSS.
// Bumped (2026-07-08): completed the Vuetify-parity utility system — spacing
// (m*/p* incl. negatives), sizing (w/h), borders + radius, text/typography,
// position, cursor, opacity, overflow, float, elevation. Responsive spacing/
// sizing dominate the growth; utilities aren't tree-shaken so this is the
// full-barrel worst case (real apps ship what they use).
const BUDGETS = [
  { label: '@rukkiecodes/vue (js, full barrel)', file: 'packages/vue/dist/index.js', maxKb: 62 },
  { label: '@rukkiecodes/vue (css)', file: 'packages/vue/dist/fusionui.css', maxKb: 38 },
  { label: '@rukkiecodes/shaders (entry)', file: 'packages/shaders/dist/index.js', maxKb: 5 },
  { label: '@rukkiecodes/tokens (css)', file: 'packages/tokens/dist/css/tokens.css', maxKb: 3 },
]

// The lazy WebGL runtime ships as its own hashed chunk — match by prefix.
const GLOB_BUDGETS = [
  {
    label: '@rukkiecodes/shaders (gl runtime, lazy)',
    dir: 'packages/shaders/dist',
    prefix: 'gl-',
    maxKb: 3,
  },
]

function kb(buf) {
  return gzipSync(buf).length / 1024
}

let failed = false
const rows = []

for (const b of BUDGETS) {
  const p = join(root, b.file)
  if (!existsSync(p)) {
    rows.push([b.label, 'MISSING — run build', '—', 'FAIL'])
    failed = true
    continue
  }
  const size = kb(readFileSync(p))
  const ok = size <= b.maxKb
  if (!ok) failed = true
  rows.push([b.label, `${size.toFixed(2)} kB gz`, `≤ ${b.maxKb} kB`, ok ? 'ok' : 'OVER'])
}

import { readdirSync } from 'node:fs'
for (const b of GLOB_BUDGETS) {
  const dir = join(root, b.dir)
  const match = existsSync(dir)
    ? readdirSync(dir).find(f => f.startsWith(b.prefix) && f.endsWith('.js'))
    : null
  if (!match) {
    rows.push([b.label, 'MISSING — run build', '—', 'FAIL'])
    failed = true
    continue
  }
  const size = kb(readFileSync(join(dir, match)))
  const ok = size <= b.maxKb
  if (!ok) failed = true
  rows.push([b.label, `${size.toFixed(2)} kB gz`, `≤ ${b.maxKb} kB`, ok ? 'ok' : 'OVER'])
}

const w = rows.reduce((m, r) => Math.max(m, r[0].length), 0)
console.log('\nFusionUI bundle budgets (gzip):\n')
for (const [label, size, budget, status] of rows) {
  const mark = status === 'ok' ? '✓' : '✗'
  console.log(
    `  ${mark} ${label.padEnd(w)}  ${size.padStart(12)}  ${budget.padStart(10)}  ${status}`
  )
}
console.log('')

if (failed) {
  console.error('✗ Bundle budget exceeded.\n')
  process.exit(1)
}
console.log('✓ All bundles within budget.\n')
