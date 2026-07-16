export default function App() {
  return (
    <Screen title="FProgress — colors" subtitle="Any theme colour for the fill.">
      <Panel caption="Colors" row={false}>
        <View style={{ gap: 18 }}>
          <FProgress value={70} color="primary" />
          <FProgress value={45} color="success" />
          <FProgress value={85} color="danger" height={10} />
        </View>
      </Panel>
    </Screen>
  )
}
