function Tile({ label }) {
  return (
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: 13,
        backgroundColor: color('surface-2'),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 22 }}>{label}</Text>
    </View>
  )
}

export default function App() {
  return (
    <Screen title="FBadge — colors" subtitle="Any theme colour for the badge fill.">
      <Panel caption="Colors">
        <FBadge content={3} color="primary">
          <Tile label="📥" />
        </FBadge>
        <FBadge content={9} color="success">
          <Tile label="✅" />
        </FBadge>
        <FBadge content={2} color="warning">
          <Tile label="⚠️" />
        </FBadge>
      </Panel>
    </Screen>
  )
}
