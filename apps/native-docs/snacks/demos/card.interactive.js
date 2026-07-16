export default function App() {
  return (
    <Screen title="FCard — interactive" subtitle="Press and hold to feel the spring lift.">
      <FCard onPress={() => {}}>
        <Text style={styles.title}>Aurora Borealis</Text>
        <Text style={styles.body}>
          Tap and hold this card: it rises and scales a hair on a spring, then settles back — the
          native echo of the web hover lift.
        </Text>
      </FCard>
    </Screen>
  )
}
