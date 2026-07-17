// Creates a saved multi-file Expo Snack per component and records its id in
// src/snack-ids.json, so the docs can embed a runnable preview by id.
//
// Each snack is: a clean App.tsx (imports the component + a small demo) plus the
// REAL copy-in source from packages/native/registry — so the default tab a reader
// sees is the clean usage, and the implementation is one tab over. Run manually
// after a component changes: `node scripts/save-snacks.mjs` (commits new ids).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const regDir = join(here, '..', '..', '..', 'packages', 'native', 'registry', 'components')
const SDK = '52.0.0'
const SAVE_URL = 'https://api.expo.dev/v2/snack/save'

// Per-component: the source files to bundle, the deps, and the clean demo App.tsx.
const specs = {
  text: {
    files: ['index.tsx', 'types.ts', 'const.ts', 'helpers.ts'],
    deps: {
      '@expo-google-fonts/poppins': '^0.2.3',
    },
    app: `import React from 'react'
import { View } from 'react-native'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { Text } from './text'

// FusionUI defaults to Poppins — load the faces the demo uses.
export default function App() {
  const [loaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold })
  if (!loaded) return null

  return (
    <View style={{ flex: 1, padding: 28, justifyContent: 'center', gap: 16, backgroundColor: '#f4f7f8' }}>
      <Text.H1 color="#0b1220">Heading 1</Text.H1>
      <Text.H3 color="#334455">Heading 3</Text.H3>
      <Text size={17} weight="semibold" color="primary">Primary emphasis</Text>
      <Text size={15} weight="normal" color="muted" numberOfLines={2}>
        A typography primitive with levels, weights and colour variants.
      </Text>
    </View>
  )
}
`,
  },
  button: {
    files: ['index.tsx', 'types.ts'],
    deps: {
      'react-native-reanimated': '~3.16.0',
      'expo-linear-gradient': '~14.0.0',
    },
    app: `import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from './button'

export default function App() {
  const [loading, setLoading] = useState(false)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, backgroundColor: '#0b1220' }}>
      <Button gradientColors={['#195bff', '#7d5fff']} onPress={() => {}}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Continue</Text>
      </Button>
      <Button
        backgroundColor="#195bff"
        isLoading={loading}
        showLoadingIndicator
        loadingText="Saving…"
        loadingTextColor="#fff"
        loadingTextBackgroundColor="#12203f"
        onPress={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 1600)
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Tap to load</Text>
      </Button>
    </View>
  )
}
`,
  },
  'gooey-switch': {
    sdk: '54.0.0',
    files: ['index.tsx', 'types.ts', 'const.ts'],
    deps: {
      'react-native-reanimated': '~4.1.1',
      '@shopify/react-native-skia': '2.2.12',
      'react-native-gesture-handler': '~2.28.0',
      'react-native-worklets': '0.5.1',
      'expo-symbols': '~1.0.8',
      '@expo/vector-icons': '^15.0.0',
    },
    extraFiles: {
      'Demo.tsx': `import React, { useState } from 'react'
import { GooeySwitch } from './gooey-switch'

export default function Demo() {
  const [on, setOn] = useState(true)
  return (
    <GooeySwitch
      active={on}
      onToggle={setOn}
      size={200}
      activeColor="#8093ff"
      trackColor="#1a1a1a"
      gooey={35}
      deformation={{ squishY: 0.5, stretchX: 1.2 }}
    />
  )
}
`,
    },
    app: `import React from 'react'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <WithSkiaWeb getComponent={() => import('./Demo')} fallback={<View />} />
      </View>
    </GestureHandlerRootView>
  )
}
`,
  },
  'apple-intelligence': {
    sdk: '54.0.0',
    files: [
      'index.tsx',
      'types.ts',
      'context.ts',
      'conf.ts',
      'const.ts',
      'helpers.ts',
      'use-siri-uniforms.ts',
    ],
    deps: {
      'react-native-reanimated': '~4.1.1',
      '@shopify/react-native-skia': '2.2.12',
      'react-native-worklets': '0.5.1',
    },
    app: `import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { SiriProvider, useSiri } from './apple-intelligence'

function Screen() {
  const { toggle, isActive } = useSiri()
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Apple Intelligence</Text>
        <Text style={styles.body}>
          Tap below to wash this screen in the Siri glow — a snapshot + SKSL shader overlay.
        </Text>
      </View>
      <Pressable style={styles.btn} onPress={() => toggle()}>
        <Text style={styles.btnText}>{isActive ? 'Dismiss' : 'Ask Siri'}</Text>
      </Pressable>
    </View>
  )
}

export default function App() {
  return (
    <SiriProvider>
      <Screen />
    </SiriProvider>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', gap: 28, padding: 24 },
  card: { backgroundColor: '#141414', borderRadius: 20, padding: 24, gap: 10, width: '100%' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  body: { color: '#8b8b8b', fontSize: 15, lineHeight: 22 },
  btn: { backgroundColor: '#8093ff', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
`,
  },
}

function buildCode(slug, spec) {
  const code = { 'App.tsx': { type: 'CODE', contents: spec.app } }
  for (const f of spec.files) {
    code[`${slug}/${f}`] = { type: 'CODE', contents: readFileSync(join(regDir, slug, f), 'utf8') }
  }
  for (const [name, contents] of Object.entries(spec.extraFiles ?? {})) {
    code[name] = { type: 'CODE', contents }
  }
  return code
}

async function save(slug, spec) {
  const payload = {
    manifest: {
      sdkVersion: spec.sdk ?? SDK,
      name: `FusionUI — ${slug}`,
      description: `The @rukkiecodes/native ${slug} component, running live.`,
      dependencies: spec.deps,
    },
    code: buildCode(slug, spec),
    dependencies: Object.fromEntries(
      Object.entries(spec.deps).map(([k, v]) => [k, { version: v }])
    ),
    isDraft: false,
  }
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data?.id) throw new Error(`save ${slug} failed (${res.status}): ${JSON.stringify(data)}`)
  return data.id
}

const ids = {}
for (const [slug, spec] of Object.entries(specs)) {
  ids[slug] = await save(slug, spec)
  console.log(`  ${slug} -> ${ids[slug]}`)
}
writeFileSync(join(here, '..', 'src', 'snack-ids.json'), JSON.stringify(ids, null, 2) + '\n')
console.log(`Wrote src/snack-ids.json (${Object.keys(ids).length} snacks)`)
