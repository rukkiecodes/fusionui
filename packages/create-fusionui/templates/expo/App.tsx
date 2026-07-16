import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Linking, ScrollView, Text, useColorScheme, View } from 'react-native'
import {
  FusionProvider,
  FShell,
  FButton,
  FCard,
  FSwitch,
  useFusionTheme,
} from '@rukkiecodes/native'

const DOCS_URL = 'https://rukkiecodes.github.io/fusionui/getting-started/native'

function Brand() {
  const theme = useFusionTheme()
  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors['on-surface'] }}>
        <Text style={{ color: theme.colors.primary }}>{'{ }'} </Text>
        FusionUI
      </Text>
    </View>
  )
}

function Welcome() {
  const theme = useFusionTheme()
  const [notify, setNotify] = useState(true)

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 48 }}>
      {/* hero */}
      <View style={{ gap: 8, paddingTop: 12 }}>
        <Text
          style={{
            fontFamily: theme.font.family.mono,
            fontSize: 12,
            letterSpacing: 1,
            color: theme.colors.primary,
          }}
        >
          REACT NATIVE · EXPO
        </Text>
        <Text
          style={{
            fontSize: 34,
            fontWeight: '800',
            letterSpacing: -1,
            lineHeight: 38,
            color: theme.colors['on-background'],
          }}
        >
          Welcome to{'\n'}
          <Text style={{ color: theme.colors.primary }}>FusionUI</Text>
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            color: theme.colors['on-background'],
            opacity: Number(theme.variables['medium-emphasis-opacity'] ?? 0.66),
          }}
        >
          A soft, modern component library for Expo — token-driven, accessible, and sharing one
          design language with the web. Everything on this screen is a real FusionUI component.
        </Text>
      </View>

      {/* live components */}
      <FCard>
        <View style={{ gap: 14 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: theme.colors['on-surface'],
              opacity: 0.6,
            }}
          >
            BUTTONS
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <FButton variant="elevated" color="primary" size="small" onPress={() => {}}>
              Primary
            </FButton>
            <FButton variant="tonal" color="success" size="small" onPress={() => {}}>
              Tonal
            </FButton>
            <FButton variant="outlined" color="danger" size="small" onPress={() => {}}>
              Outlined
            </FButton>
            <FButton variant="gradient" color="secondary" size="small" onPress={() => {}}>
              Gradient
            </FButton>
          </View>

          <View style={{ height: 1, backgroundColor: theme.colors['on-surface'], opacity: 0.08 }} />

          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={{ color: theme.colors['on-surface'] }}>Notifications</Text>
            <FSwitch value={notify} color="primary" onValueChange={setNotify} />
          </View>
        </View>
      </FCard>

      {/* docs cta */}
      <FButton variant="elevated" color="primary" block onPress={() => Linking.openURL(DOCS_URL)}>
        Read the docs
      </FButton>

      <Text
        style={{
          textAlign: 'center',
          fontSize: 13,
          color: theme.colors['on-background'],
          opacity: 0.55,
        }}
      >
        Edit <Text style={{ fontFamily: theme.font.family.mono }}>App.tsx</Text> and save — fast
        refresh does the rest.
      </Text>
    </ScrollView>
  )
}

export default function App() {
  // Start in the device's theme. FusionProvider wraps the app once so every
  // component reads the tokens; FShell frames the screen with the navbar and the
  // signature goo corner (drawn with Skia).
  const scheme = useColorScheme()

  return (
    <FusionProvider theme={scheme === 'dark' ? 'dark' : 'light'}>
      <FShell navbar={<Brand />} navbarHeight={56}>
        <Welcome />
      </FShell>
      <StatusBar style="auto" />
    </FusionProvider>
  )
}
