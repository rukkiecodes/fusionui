export default function App() {
  const [key, setKey] = useState(0)
  return (
    <Screen title="FAlert — closable" subtitle="Tap ✕ to fade it out; reset to bring them back.">
      <View key={key} style={{ gap: 12 }}>
        <FAlert closable type="info" title="Dismiss me" text="I fade out with Reanimated." />
        <FAlert closable variant="solid" color="primary" title="Closable solid" text="Tap the ✕." />
      </View>
      <Pressable
        onPress={() => setKey(k => k + 1)}
        style={{
          alignSelf: 'flex-start',
          marginTop: 14,
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 10,
          backgroundColor: withAlpha(color('primary'), 0.12),
        }}
      >
        <Text style={{ color: color('primary'), fontWeight: '600', fontSize: 13 }}>
          Reset closed alerts
        </Text>
      </Pressable>
    </Screen>
  )
}
