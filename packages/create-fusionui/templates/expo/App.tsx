import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import {
  FusionProvider,
  FShell,
  FButton,
  FCard,
  FInput,
  FSwitch,
  LiquidGlassView,
  useFusionTheme,
} from '@fusionui/native'

function Brand() {
  const theme = useFusionTheme()
  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors['on-surface'] }}>
        FusionUI
      </Text>
    </View>
  )
}

function Screen() {
  const theme = useFusionTheme()
  const [count, setCount] = useState(0)
  const [on, setOn] = useState(true)

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <FCard>
        <View style={{ gap: 12 }}>
          <FInput label="Email" placeholder="you@example.com" />
          <FButton variant="elevated" color="primary" onPress={() => setCount(c => c + 1)}>
            {`Clicked ${count}×`}
          </FButton>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <FSwitch value={on} onValueChange={setOn} />
            <Text style={{ color: theme.colors['on-surface'] }}>Notifications</Text>
          </View>
        </View>
      </FCard>

      {/* The signature liquid-glass surface over a gradient backdrop. */}
      <View
        style={{ height: 180, borderRadius: 20, overflow: 'hidden', backgroundColor: '#195bff' }}
      >
        <LiquidGlassView radius={24} style={{ position: 'absolute', inset: 28 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Liquid glass</Text>
        </LiquidGlassView>
      </View>
    </ScrollView>
  )
}

export default function App() {
  // FusionProvider wraps the app once so every component reads the tokens.
  // FShell frames the screen with the navbar; the content nestles in with the
  // fluid goo corner (drawn with Skia from the shared shell engine).
  return (
    <FusionProvider theme="light">
      <FShell navbar={<Brand />} navbarHeight={56}>
        <Screen />
      </FShell>
      <StatusBar style="dark" />
    </FusionProvider>
  )
}
