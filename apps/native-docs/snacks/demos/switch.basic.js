export default function App() {
  const [on, setOn] = useState(true)
  return (
    <Screen title="FSwitch — bound state" subtitle="A single toggle wired to component state.">
      <Panel caption="Bound state" row={false}>
        <Row label="Notifications" caption={on ? 'On — push enabled' : 'Off — muted'}>
          <FSwitch value={on} onValueChange={setOn} />
        </Row>
      </Panel>
    </Screen>
  )
}
