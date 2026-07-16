export default function App() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <Screen title="FCheckbox — bound" subtitle="Tap the row or the box to toggle.">
      <Panel caption="Bound" row={false}>
        <View style={{ gap: 16 }}>
          <FCheckbox value={a} onValueChange={setA} label="Email me product updates" />
          <FCheckbox value={b} onValueChange={setB} label="Subscribe to the newsletter" />
        </View>
      </Panel>
    </Screen>
  )
}
