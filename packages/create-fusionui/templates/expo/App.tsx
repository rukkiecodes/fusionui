import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import {
  FusionProvider,
  FButton,
  FCard,
  FInput,
  FSwitch,
  LiquidGlassView,
  useFusionTheme,
} from '@fusionui/native'

function Demo() {
  const theme = useFusionTheme()
  const [count, setCount] = useState(0)
  const [on, setOn] = useState(true)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colors['on-background'] }}>
          FusionUI
        </Text>

        <FCard>
          <View style={{ gap: 12 }}>
            <FInput label="Email" placeholder="you@example.com" />
            <FButton variant="elevated" color="primary" onPress={() => setCount(c => c + 1)}>
              {`Clicked ${count}×`}
            </FButton>
            <FSwitch value={on} onValueChange={setOn} />
          </View>
        </FCard>

        {/* The signature liquid-glass surface over a gradient backdrop. */}
        <View
          style={{ height: 200, borderRadius: 20, overflow: 'hidden', backgroundColor: '#195bff' }}
        >
          <LiquidGlassView radius={24} style={{ position: 'absolute', inset: 32 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Liquid glass</Text>
          </LiquidGlassView>
        </View>
      </ScrollView>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <FusionProvider theme="light">
      <Demo />
    </FusionProvider>
  )
}
