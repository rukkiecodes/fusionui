export default function App() {
  const [v, setV] = useState('')
  return (
    <Screen title="FOtp — six digits" subtitle="Tap to focus, then type — digits fill the cells.">
      <Panel caption="Verification code" row={false}>
        <FOtp value={v} onChangeText={setV} length={6} />
      </Panel>
    </Screen>
  )
}
