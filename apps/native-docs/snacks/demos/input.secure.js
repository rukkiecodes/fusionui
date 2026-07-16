export default function App() {
  const [pwd, setPwd] = useState('')
  return (
    <Screen
      title="FInput — password & disabled"
      subtitle="Secure entry, and a locked disabled field."
    >
      <Section caption="Password">
        <FInput
          label="Password"
          placeholder="••••••••"
          value={pwd}
          onChangeText={setPwd}
          secureTextEntry
          autoCapitalize="none"
        />
      </Section>
      <Section caption="Disabled">
        <FInput label="Account ID" value="usr_8f31c0" onChangeText={() => {}} disabled />
      </Section>
    </Screen>
  )
}
