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
    <Screen title="FBadge — numeric" subtitle="A count pinned to an element, capped at max.">
      <Panel caption="Numeric">
        <FBadge content={5}>
          <Tile label="🔔" />
        </FBadge>
        <FBadge content={128} max={99}>
          <Tile label="✉️" />
        </FBadge>
      </Panel>
    </Screen>
  )
}
