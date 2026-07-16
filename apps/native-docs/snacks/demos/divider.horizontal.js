export default function App() {
  return (
    <Screen title="FDivider — horizontal" subtitle="Between rows, full-width or inset.">
      <Panel caption="Horizontal & inset" row={false}>
        <Row label="Profile" />
        <FDivider />
        <Row label="Notifications" />
        <FDivider inset />
        <Row label="Privacy" />
      </Panel>
    </Screen>
  )
}
