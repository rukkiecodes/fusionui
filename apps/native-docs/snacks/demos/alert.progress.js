export default function App() {
  const [pct, setPct] = useState(35)
  const btn = {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: color('primary'),
  }
  const txt = { color: '#fff', fontWeight: '600' }
  return (
    <Screen title="FAlert — progress" subtitle="An animated bottom bar tracks a value.">
      <FAlert type="info" title="Uploading…" text={`${pct}% complete`} progress={pct} />
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Pressable onPress={() => setPct(p => Math.max(0, p - 20))} style={btn}>
          <Text style={txt}>−20</Text>
        </Pressable>
        <Pressable onPress={() => setPct(p => Math.min(100, p + 20))} style={btn}>
          <Text style={txt}>+20</Text>
        </Pressable>
      </View>
    </Screen>
  )
}
