export default function App() {
  return (
    <Screen title="FCard — flat" subtitle="No shadow: a quieter surface-2 fill with a hairline.">
      <FCard flat>
        <Text style={styles.title}>Flat list item</Text>
        <Text style={styles.body}>
          A quieter surface for dense lists — no resting elevation, just a hairline border against
          the page.
        </Text>
      </FCard>
    </Screen>
  )
}
