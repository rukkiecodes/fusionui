export default function App() {
  return (
    <Screen title="FCheckbox — disabled" subtitle="Locked checked and unchecked states.">
      <Panel caption="Disabled" row={false}>
        <View style={{ gap: 16 }}>
          <FCheckbox value={true} onValueChange={() => {}} disabled label="Locked checked" />
          <FCheckbox value={false} onValueChange={() => {}} disabled label="Locked unchecked" />
        </View>
      </Panel>
    </Screen>
  )
}
