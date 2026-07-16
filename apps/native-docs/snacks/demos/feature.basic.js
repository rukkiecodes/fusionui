export default function App() {
  return (
    <Screen title="FFeature — single" subtitle="One feature with an icon tile.">
      <View
        style={{
          backgroundColor: color('surface'),
          borderRadius: T.radius.lg,
          padding: 20,
          ...shadowRest,
          shadowOpacity: 0.06,
        }}
      >
        <FFeature
          icon={<Text style={{ fontSize: 22 }}>⚡</Text>}
          title="Fast by default"
          text="Token-driven styles resolve at build time — no runtime stylesheet to parse."
        />
      </View>
    </Screen>
  )
}
