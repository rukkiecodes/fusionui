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
    <Screen title="FBadge — dot" subtitle="A bare status dot with no count.">
      <Panel caption="Dot">
        <FBadge dot color="success">
          <Tile label="👤" />
        </FBadge>
        <FBadge dot color="danger">
          <Tile label="💬" />
        </FBadge>
      </Panel>
    </Screen>
  )
}
