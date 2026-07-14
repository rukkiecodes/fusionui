#!/usr/bin/env node
/**
 * Generates the FusionUI logo.
 *
 * The mark is two translucent panels fusing, with light refracting through the
 * overlap — the library's liquid-glass layer, reduced to one shape. It says
 * "fusion" literally (two things becoming one) and it says what FusionUI *is*
 * (layered translucent surfaces), without borrowing a glyph from the icon set
 * the way the old feather mark did.
 *
 * Geometry over organics was a deliberate call: a goo/metaball contour is more
 * on-brand in theory, but it renders as an anonymous blob at 24px, and a logo
 * has to survive a favicon.
 *
 * Colours come from the tokens, never hand-typed.
 *
 *   node tools/gen-logo.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const light = JSON.parse(readFileSync(join(root, 'packages/tokens/src/themes/light.json'), 'utf8'))
const PRIMARY = light.colors.primary // #195bff
const SECONDARY = light.colors.secondary // #7d33ff

// Two 30×30 panels on a 64 grid, offset diagonally so they overlap by 14 — big
// enough for the refraction lens to read at 16px, small enough that you still
// see two distinct panels.
const S = 30
const R = 9
const A = { x: 8, y: 8 }
const B = { x: 26, y: 26 }

const panel = (p, fill, extra = '') =>
  `<rect x="${p.x}" y="${p.y}" width="${S}" height="${S}" rx="${R}" fill="${fill}"${extra} />`

function mark({ onDark = false } = {}) {
  // The lens is where the two panels cross. Light passing through both is
  // brighter, not darker — that is what makes it read as glass rather than ink.
  const lens = onDark ? '#ffffff' : '#ffffff'
  return `
  <defs>
    <linearGradient id="fui-a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PRIMARY}" />
      <stop offset="1" stop-color="${PRIMARY}" stop-opacity="0.82" />
    </linearGradient>
    <linearGradient id="fui-b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${SECONDARY}" stop-opacity="0.92" />
      <stop offset="1" stop-color="${SECONDARY}" />
    </linearGradient>
    <clipPath id="fui-lens">
      ${panel(A, '#000')}
    </clipPath>
  </defs>

  ${panel(A, 'url(#fui-a)')}
  ${panel(B, 'url(#fui-b)')}

  <!-- The refraction: panel B clipped to where it crosses panel A. -->
  <g clip-path="url(#fui-lens)">
    ${panel(B, lens, ' fill-opacity="0.86"')}
  </g>`
}

const svg = (body, { size = 64, tile = false } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="FusionUI">${
    tile
      ? `
  <rect width="${size}" height="${size}" rx="14" fill="#ffffff" />`
      : ''
  }${body}
</svg>
`

// The transparent mark, for the navbar / README / docs.
const logo = svg(mark())

// The tile, for favicons and app icons: the same mark, inset, on white so it
// keeps its contrast against a dark browser chrome.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="FusionUI">
  <defs>
    <linearGradient id="fui-tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PRIMARY}" />
      <stop offset="1" stop-color="${SECONDARY}" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#fui-tile)" />
  <!-- On the tile the panels are white-on-gradient, so the lens is the *brightest*
       element and the mark still reads at 16px. -->
  <rect x="13" y="13" width="26" height="26" rx="8" fill="#fff" fill-opacity="0.62" />
  <rect x="25" y="25" width="26" height="26" rx="8" fill="#fff" fill-opacity="0.62" />
  <path d="M25 25h14v14H25z" fill="#fff" />
</svg>
`

const targets = [
  ['apps/docs/public/logo.svg', logo],
  ['apps/docs/public/favicon.svg', favicon],
  ['packages/create-fusionui/templates/vue/public/favicon.svg', favicon],
  ['packages/create-fusionui/templates/nuxt/public/favicon.svg', favicon],
]

for (const [rel, contents] of targets) {
  const dest = join(root, rel)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, contents)
  console.log(`  ${rel}`)
}

console.log('\n✔ logo generated')
