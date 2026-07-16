export default function App() {
  return (
    <Screen title="FInput — error" subtitle="A danger border and message when validation fails.">
      <Section>
        <FInput
          label="Username"
          placeholder="pick a handle"
          value="ab"
          onChangeText={() => {}}
          error="Must be at least 3 characters."
        />
      </Section>
    </Screen>
  )
}
