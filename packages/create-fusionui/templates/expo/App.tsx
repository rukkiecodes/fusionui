import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { ScrollView, Text, useColorScheme, View } from 'react-native'
import {
  FusionProvider,
  FShell,
  FButton,
  FCard,
  FInput,
  FSwitch,
  useFusionTheme,
} from '@rukkiecodes/native'

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
    </ScrollView>
  )
}

export default function App() {
  // Start in the device's theme, and follow it when the user switches. FusionProvider
  // wraps the app once so every component reads the tokens; FShell frames the screen
  // with the navbar, the content nestling in with the fluid goo corner (drawn with
  // Skia from the shared shell engine).
  const scheme = useColorScheme()

  return (
    <FusionProvider theme={scheme === 'dark' ? 'dark' : 'light'}>
      <FShell navbar={<Brand />} navbarHeight={56}>
        <Screen />
      </FShell>
      {/* `auto` picks the bar style from the device theme. */}
      <StatusBar style="auto" />
    </FusionProvider>
  )
}
