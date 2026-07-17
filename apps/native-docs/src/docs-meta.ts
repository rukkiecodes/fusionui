// Per-component documentation that isn't part of the CLI's registry contract:
// the props table and a usage snippet. Keyed by the same slug as
// packages/native/registry/registry.json.

export interface ApiRow {
  prop: string
  type: string
  default?: string
}

export interface DocMeta {
  api: ApiRow[]
  usage: string
  /** Snack preview platform — 'web' (in-browser) by default; 'mydevice' for GPU/Skia
   *  components that Snack can't render in-browser (scan the QR to run on a device). */
  snackPlatform?: 'web' | 'mydevice'
}

export const docsMeta: Record<string, DocMeta> = {
  text: {
    api: [
      { prop: 'level', type: "'h1' … 'h6'", default: '—' },
      { prop: 'size', type: 'number', default: '18' },
      { prop: 'weight', type: "'thin' … 'black'", default: "'bold'" },
      { prop: 'fontFamily', type: 'string', default: 'Poppins (per weight)' },
      { prop: 'color', type: 'string | colour variant', default: "'#FFFFFF'" },
      { prop: 'align', type: "'left' | 'center' | 'right' | 'justify'", default: "'left'" },
      { prop: 'numberOfLines', type: 'number', default: '—' },
      { prop: 'loading', type: 'boolean (skeleton)', default: 'false' },
      { prop: 'prefix / suffix', type: 'ReactNode', default: '—' },
    ],
    usage: `import { useFonts, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { Text } from './components/ui/text'

// FusionUI defaults to Poppins — load the faces you use.
export function Example() {
  const [loaded] = useFonts({ Poppins_500Medium, Poppins_700Bold })
  if (!loaded) return null

  return (
    <>
      <Text.H1 color="primary">Welcome</Text.H1>
      <Text size={16} weight="medium" color="muted" numberOfLines={2}>
        A typography primitive with levels, weights and colour variants.
      </Text>
    </>
  )
}`,
  },
  button: {
    api: [
      { prop: 'onPress', type: '() => void', default: '—' },
      { prop: 'backgroundColor', type: 'string', default: "'#fff'" },
      { prop: 'gradientColors', type: 'string[]', default: '—' },
      { prop: 'isLoading', type: 'boolean', default: 'false' },
      { prop: 'loadingText', type: 'string', default: "'Loading...'" },
      { prop: 'width / height', type: 'number', default: '220 / 52' },
      { prop: 'borderRadius', type: 'number', default: 'height / 2' },
      { prop: 'disabled', type: 'boolean', default: 'false' },
    ],
    usage: `import { Button } from './components/ui/button'
import { Text } from './components/ui/text'

export function Example() {
  return (
    <Button gradientColors={['#195bff', '#7d5fff']} onPress={save}>
      <Text color="#fff" weight="bold">
        Continue
      </Text>
    </Button>
  )
}`,
  },
  'gooey-switch': {
    snackPlatform: 'mydevice',
    api: [
      { prop: 'active / onToggle', type: 'boolean / (v) => void', default: '—' },
      { prop: 'size', type: 'number', default: '200' },
      { prop: 'activeColor / inactiveColor', type: 'string', default: "'#34D399' / '#9CA3AF'" },
      { prop: 'trackColor', type: 'string (the blob)', default: "'#1F2937'" },
      { prop: 'gooey', type: 'number (goo intensity)', default: '35' },
      { prop: 'deformation', type: '{ stretchX, squishY, sideBlobScale }', default: '—' },
      { prop: 'showIcons', type: 'boolean', default: 'true' },
      { prop: 'isDisabled', type: 'boolean', default: 'false' },
    ],
    usage: `import { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { GooeySwitch } from './components/ui/gooey-switch'

export function Example() {
  const [on, setOn] = useState(true)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GooeySwitch
        active={on}
        onToggle={setOn}
        size={200}
        activeColor="#8093ff"
        trackColor="#1a1a1a"
        gooey={35}
        deformation={{ squishY: 0.5, stretchX: 1.2 }}
      />
    </GestureHandlerRootView>
  )
}`,
  },
  'apple-intelligence': {
    snackPlatform: 'mydevice',
    api: [
      { prop: 'children', type: 'ReactNode', default: '—' },
      { prop: 'introDuration / outroDuration', type: 'number (ms)', default: '1200 / 600' },
      { prop: 'glow', type: '{ speed, saturation, lightness, colors }', default: '—' },
      { prop: 'wave', type: '{ speed, strength, origin }', default: '—' },
      { prop: 'shimmer', type: '{ amount, speed }', default: '—' },
      { prop: 'border', type: '{ margin, spread, radius }', default: '—' },
      { prop: 'useSiri()', type: '{ toggle, isActive, setOverlay }', default: '—' },
    ],
    usage: `import { Pressable, Text } from 'react-native'
import { SiriProvider, useSiri } from './components/ui/apple-intelligence'

function Screen() {
  const { toggle } = useSiri()
  return (
    <Pressable onPress={() => toggle()}>
      <Text>Ask Siri</Text>
    </Pressable>
  )
}

export default function App() {
  return (
    <SiriProvider>
      <Screen />
    </SiriProvider>
  )
}`,
  },
}
