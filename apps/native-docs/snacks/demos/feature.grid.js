export default function App() {
  const card = {
    flex: 1,
    backgroundColor: color('surface'),
    borderRadius: T.radius.lg,
    padding: 18,
    ...shadowRest,
    shadowOpacity: 0.06,
  }
  return (
    <Screen title="FFeature — grid" subtitle="Two features side by side.">
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={card}>
          <FFeature
            icon={<Text style={{ fontSize: 20 }}>🎨</Text>}
            title="Themed"
            text="One token source, both platforms."
          />
        </View>
        <View style={card}>
          <FFeature
            icon={<Text style={{ fontSize: 20 }}>♿</Text>}
            title="Accessible"
            text="Roles and state on every control."
          />
        </View>
      </View>
    </Screen>
  )
}
