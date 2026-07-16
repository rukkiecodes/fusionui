export default function App() {
  return (
    <Screen
      title="FButton — states"
      subtitle="A dual-ring loader swaps the label; disabled dims and blocks the press."
    >
      <Panel caption="States">
        <FButton loading>Saving</FButton>
        <FButton disabled>Disabled</FButton>
        <FButton variant="tonal" loading>
          Loading
        </FButton>
      </Panel>
    </Screen>
  )
}
