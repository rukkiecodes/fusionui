export default function App() {
  return (
    <Screen title="FTextarea — error" subtitle="A danger border and message on invalid input.">
      <Section>
        <FTextarea
          label="Feedback"
          value="Too short"
          onChangeText={() => {}}
          error="Please add at least 20 characters."
          rows={4}
        />
      </Section>
    </Screen>
  )
}
