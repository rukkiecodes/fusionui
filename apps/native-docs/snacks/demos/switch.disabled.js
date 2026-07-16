export default function App() {
  return (
    <Screen
      title="FSwitch — disabled"
      subtitle="Locked on and locked off — dimmed and unpressable."
    >
      <Panel caption="Disabled" row={false}>
        <Row label="Locked on" caption="Cannot be changed">
          <FSwitch value={true} onValueChange={() => {}} disabled />
        </Row>
        <Divider />
        <Row label="Locked off" caption="Cannot be changed">
          <FSwitch value={false} onValueChange={() => {}} disabled />
        </Row>
      </Panel>
    </Screen>
  )
}
