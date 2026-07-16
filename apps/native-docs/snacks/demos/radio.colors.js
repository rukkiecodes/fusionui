export default function App() {
  const [v, setV] = useState('b')
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ]
  return (
    <Screen title="FRadio — colors" subtitle="The selected ring + dot take any theme colour.">
      <Panel caption="Success accent" row={false}>
        <FRadioGroup value={v} onValueChange={setV} color="success" options={options} />
      </Panel>
    </Screen>
  )
}
