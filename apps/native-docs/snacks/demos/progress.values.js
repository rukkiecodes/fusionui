export default function App() {
  const [v, setV] = useState(30)
  return (
    <Screen title="FProgress — values" subtitle="Tap advance — the fill animates to each value.">
      <Panel caption="Values" row={false}>
        <FProgress value={v} />
        <View style={{ height: 18 }} />
        <Pressable
          onPress={() => setV(x => (x >= 100 ? 0 : x + 20))}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: withAlpha(color('primary'), 0.15),
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: color('primary'), fontWeight: '600' }}>Advance ({v}%)</Text>
        </Pressable>
      </Panel>
    </Screen>
  )
}
