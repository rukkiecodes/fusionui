export default function App() {
  const [v, setV] = useState('standard')
  const options = [
    { label: 'Standard — 3–5 days', value: 'standard' },
    { label: 'Express — 1–2 days', value: 'express' },
    { label: 'Overnight', value: 'overnight' },
  ]
  return (
    <Screen title="FRadio — group" subtitle="Bind a value; the group emits the choice.">
      <Panel caption="Delivery" row={false}>
        <FRadioGroup value={v} onValueChange={setV} options={options} />
      </Panel>
    </Screen>
  )
}
