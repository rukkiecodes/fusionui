export default function App() {
  const [email, setEmail] = useState('')
  return (
    <Screen
      title="FInput — helper & success"
      subtitle="A helper line, and a success accent when valid."
    >
      <Section caption="Helper message">
        <FInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          message="We will never share your email."
        />
      </Section>
      <Section caption="Success accent">
        <FInput
          label="Promo code"
          value="FUSION20"
          onChangeText={() => {}}
          color="success"
          message="Code applied."
        />
      </Section>
    </Screen>
  )
}
