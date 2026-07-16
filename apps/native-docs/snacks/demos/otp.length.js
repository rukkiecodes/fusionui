export default function App() {
  const [v, setV] = useState('')
  return (
    <Screen title="FOtp — four digits" subtitle="Any length via the length prop.">
      <Panel caption="PIN" row={false}>
        <FOtp value={v} onChangeText={setV} length={4} color="success" />
      </Panel>
    </Screen>
  )
}
