export default function App() {
  const [name, setName] = useState('')
  return (
    <Screen title="FInput — basic" subtitle="Labelled and bound. Focus to see the accent slide in.">
      <Section>
        <FInput
          label="Full name"
          placeholder="Ada Lovelace"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </Section>
    </Screen>
  )
}
