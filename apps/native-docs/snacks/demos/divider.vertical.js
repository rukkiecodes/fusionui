export default function App() {
  return (
    <Screen title="FDivider — vertical" subtitle="Separating items in a row.">
      <Panel caption="Vertical">
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, gap: 16 }}>
          <Text style={{ color: color('on-surface'), fontWeight: '600' }}>Edit</Text>
          <FDivider vertical />
          <Text style={{ color: color('on-surface'), fontWeight: '600' }}>Share</Text>
          <FDivider vertical />
          <Text style={{ color: color('danger'), fontWeight: '600' }}>Delete</Text>
        </View>
      </Panel>
    </Screen>
  )
}
