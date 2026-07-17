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
      {
        prop: 'variant',
        type: "'solid' | 'relief' | 'shadow' | 'floating' | 'link'",
        default: "'solid'",
      },
      { prop: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'" },
      { prop: 'block', type: 'boolean (full width)', default: 'false' },
      { prop: 'iconOnly', type: 'boolean (square 1:1)', default: 'false' },
      { prop: 'leftIcon / rightIcon', type: 'ReactNode', default: '—' },
      { prop: 'circle / square', type: 'boolean (shape)', default: 'false' },
      { prop: 'isLoading / upload', type: 'boolean', default: 'false' },
      { prop: 'href', type: 'string (opens URL)', default: '—' },
      { prop: 'backgroundColor', type: 'string', default: "'#195bff'" },
      { prop: 'gradientColors', type: 'string[]', default: '—' },
      { prop: 'onPress / disabled', type: '() => void / boolean', default: '—' },
    ],
    usage: `import { Button, ButtonGroup } from './components/ui/button'
import { Text } from './components/ui/text'

export function Example() {
  return (
    <>
      <Button variant="relief" backgroundColor="#195bff" onPress={save}>
        <Text color="#fff" weight="bold">Continue</Text>
      </Button>

      <Button variant="floating" size="lg" leftIcon={<Icon />}>
        <Text color="#fff" weight="bold">Upload</Text>
      </Button>

      <ButtonGroup divided>
        <Button size="sm"><Text color="#fff">Day</Text></Button>
        <Button size="sm"><Text color="#fff">Week</Text></Button>
      </ButtonGroup>
    </>
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
  aurora: {
    snackPlatform: 'mydevice',
    api: [
      {
        prop: 'auroraColors',
        type: 'string[] (up to 3 hex)',
        default: "['#00FF87', '#60EFFF', '#B967FF']",
      },
      { prop: 'skyColors', type: '[top, bottom] hex', default: "['#020308', '#0D1B2A']" },
      { prop: 'speed', type: 'number', default: '0.5' },
      { prop: 'intensity', type: 'number', default: '1' },
      { prop: 'waveDirection', type: '[number, number]', default: '[9, -9]' },
      { prop: 'width / height', type: 'number', default: 'screen / 25% of screen' },
    ],
    usage: `import { View } from 'react-native'
import { Aurora } from './components/ui/aurora'

export function Example() {
  return (
    <View style={{ flex: 1, backgroundColor: '#020308' }}>
      <Aurora speed={0.5} intensity={1} />
    </View>
  )
}`,
  },
  badge: {
    api: [
      {
        prop: 'variant',
        type: "'default' | 'success' | 'warning' | 'error' | 'pending' | 'notifications'",
        default: "'default'",
      },
      { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { prop: 'radius', type: "'none' … '10xl' | 'full' | 'pill'", default: "'md'" },
      { prop: 'label', type: 'string', default: '—' },
      { prop: 'icon', type: 'ReactNode', default: '—' },
    ],
    usage: `import { Badge } from './components/ui/badge'

export function Example() {
  return (
    <>
      <Badge label="Default" />
      <Badge label="Success" variant="success" />
      <Badge label="Error" variant="error" size="lg" radius="pill" />
    </>
  )
}`,
  },
}
