export default function App() {
  const options = [
    { label: 'Locked A', value: 'a' },
    { label: 'Locked B', value: 'b' },
  ]
  return (
    <Screen title="FRadio — disabled" subtitle="A locked group that cannot change.">
      <Panel caption="Disabled" row={false}>
        <FRadioGroup value="a" onValueChange={() => {}} disabled options={options} />
      </Panel>
    </Screen>
  )
}
