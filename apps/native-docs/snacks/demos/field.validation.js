export default function App() {
  const [v, setV] = useState('')
  return (
    <Screen
      title="FField — required & error"
      subtitle="A required marker, and the danger error state."
    >
      <Section caption="Required">
        <FField label="Email" required message="We'll send a confirmation.">
          <FieldInput
            value={v}
            onChangeText={setV}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </FField>
      </Section>
      <Section caption="Error">
        <FField label="Username" error="That handle is taken.">
          <FieldInput value="ada" onChangeText={() => {}} />
        </FField>
      </Section>
    </Screen>
  )
}
