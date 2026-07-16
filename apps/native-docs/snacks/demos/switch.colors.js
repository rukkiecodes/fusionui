export default function App() {
  const [pri, setPri] = useState(true)
  const [suc, setSuc] = useState(true)
  const [dan, setDan] = useState(false)
  return (
    <Screen title="FSwitch — colors" subtitle="The track fills with any theme colour when on.">
      <Panel caption="Colors" row={false}>
        <Row label="Primary" caption="Default accent">
          <FSwitch value={pri} onValueChange={setPri} color="primary" />
        </Row>
        <Divider />
        <Row label="Success" caption="Positive / confirm">
          <FSwitch value={suc} onValueChange={setSuc} color="success" />
        </Row>
        <Divider />
        <Row label="Danger" caption="Destructive toggle">
          <FSwitch value={dan} onValueChange={setDan} color="danger" />
        </Row>
      </Panel>
    </Screen>
  )
}
