#!/usr/bin/env node
// Adds a custom icon to the Feather set, then regenerates the modules.
//
//   node scripts/add-icon.mjs <name> <path-to-svg>
//   pnpm --filter @fusionui/icons add-icon my-logo ./my-logo.svg
//
// The SVG must follow Feather conventions so it matches the rest of the set:
//   - 24x24 viewBox
//   - stroke="currentColor", fill="none", stroke-width="2"
//   - stroke-linecap="round", stroke-linejoin="round"

import { copyFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const [name, src] = process.argv.slice(2)

if (!name || !src) {
  console.error('Usage: node scripts/add-icon.mjs <name> <path-to-svg>')
  process.exit(1)
}
if (!/^[a-z0-9-]+$/.test(name)) {
  console.error(`Invalid name "${name}". Use lowercase kebab-case (e.g. my-logo).`)
  process.exit(1)
}
if (!existsSync(src)) {
  console.error(`SVG not found: ${src}`)
  process.exit(1)
}

copyFileSync(src, join(__dirname, '..', 'svg', `${name}.svg`))
execFileSync('node', [join(__dirname, 'build-icons.mjs')], { stdio: 'inherit' })
console.log(`Added icon "${name}". Import it as the PascalCase export from @fusionui/icons.`)
