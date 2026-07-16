// Snack generator. Composes one self-contained Expo Snack per component variant
// from three DRY pieces:
//
//   [import header]  — the RN/Reanimated imports every snack needs (+ per-component extras)
//   snacks/kit.js    — the shared token layer + demo chrome (Screen/Panel/Row/…)
//   snacks/parts/X   — the component mirror (a pure-RN sibling of @rukkiecodes/native/X)
//   snacks/demos/Y   — a small `export default App` showing ONE variant
//
// Output: snacks/gen/<slug>.<variant>.js (globbed by NativeSnack.vue) and
// snacks/manifest.json (drives the nav + the dynamic component page).
//
// Run via `pnpm gen:snacks`, or automatically through predev / prebuild.

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { components } from '../snacks/registry.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const snacksDir = join(here, '..', 'snacks')
const genDir = join(snacksDir, 'gen')

// The import surface shared by every snack. Unused names are harmless (Babel does
// not error on them); optional native modules (skia, gradient) are added per-part.
const BASE_IMPORTS = [
  "import React, { useState, useEffect, useRef, useMemo } from 'react'",
  "import { SafeAreaView, ScrollView, View, Text, Pressable, TextInput, Image, Modal, StyleSheet, useColorScheme, Platform } from 'react-native'",
  "import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, withDelay, withSequence, interpolate, interpolateColor, useReducedMotion, Easing, cancelAnimation, runOnJS, ReduceMotion } from 'react-native-reanimated'",
]
// Every snack depends on Reanimated (the base import pulls it in).
const BASE_DEPS = ['react-native-reanimated']

// The Expo Snack embed renders a code pane + a phone preview; below this the phone
// gets clipped. Every snack is floored to it (a variant may ask for more).
const MIN_SNACK_HEIGHT = 700

const read = p => readFileSync(p, 'utf8')

function compose({ comp, part, demo }) {
  const imports = [...BASE_IMPORTS, ...(comp.imports ?? [])].join('\n')
  return [
    `// FusionUI — @rukkiecodes/native · ${comp.component}`,
    '// Generated snack (do not edit here — see apps/native-docs/snacks/).',
    imports,
    '',
    read(join(snacksDir, 'kit.js')),
    '',
    part,
    '',
    demo,
    '',
  ].join('\n')
}

// Fresh gen dir every run so removed variants don't linger.
rmSync(genDir, { recursive: true, force: true })
mkdirSync(genDir, { recursive: true })

const manifest = []
let snackCount = 0

for (const comp of components) {
  const part = read(join(snacksDir, 'parts', `${comp.part}.js`))
  const variants = []

  for (const v of comp.variants) {
    const demoPath = join(snacksDir, 'demos', `${comp.slug}.${v.id}.js`)
    const demo = read(demoPath)
    const name = `${comp.slug}.${v.id}`
    writeFileSync(join(genDir, `${name}.js`), compose({ comp, part, demo }))
    snackCount++

    const deps = [...new Set([...BASE_DEPS, ...(comp.deps ?? []), ...(v.deps ?? [])])].join(',')
    variants.push({
      id: v.id,
      title: v.title,
      blurb: v.blurb ?? '',
      snack: name,
      deps,
      height: Math.max(v.height ?? MIN_SNACK_HEIGHT, MIN_SNACK_HEIGHT),
    })
  }

  manifest.push({
    slug: comp.slug,
    component: comp.component,
    title: comp.title,
    category: comp.category,
    description: comp.description,
    web: comp.web ?? '',
    api: comp.api ?? [],
    variants,
  })
}

writeFileSync(join(snacksDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')

// Sanity: every demo file should belong to a registered variant.
const demoFiles = readdirSync(join(snacksDir, 'demos')).filter(f => f.endsWith('.js'))
const known = new Set(components.flatMap(c => c.variants.map(v => `${c.slug}.${v.id}.js`)))
const orphans = demoFiles.filter(f => !known.has(f))
if (orphans.length) console.warn(`[gen-snacks] unreferenced demos: ${orphans.join(', ')}`)

console.log(
  `[gen-snacks] ${snackCount} snacks across ${components.length} components → snacks/gen/`
)
