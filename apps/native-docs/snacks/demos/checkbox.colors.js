export default function App() {
  const [p, setP] = useState(true)
  const [s, setS] = useState(true)
  const [d, setD] = useState(true)
  return (
    <Screen title="FCheckbox — colors" subtitle="The filled box takes any theme colour.">
      <Panel caption="Colors" row={false}>
        <View style={{ gap: 16 }}>
          <FCheckbox value={p} onValueChange={setP} color="primary" label="Primary" />
          <FCheckbox value={s} onValueChange={setS} color="success" label="Success" />
          <FCheckbox value={d} onValueChange={setD} color="danger" label="Danger" />
        </View>
      </Panel>
    </Screen>
  )
}
