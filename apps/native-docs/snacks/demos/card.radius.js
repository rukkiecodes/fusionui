export default function App() {
  return (
    <Screen title="FCard — custom radius" subtitle="Tighten the radius and compose freely inside.">
      <FCard onPress={() => {}} radius={T.radius.md} padding={18}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Release notes</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>NEW</Text>
          </View>
        </View>
        <Text style={styles.body}>
          A tighter 12px radius and an inline pill — pure View + Text from the token table.
        </Text>
      </FCard>
    </Screen>
  )
}
