export default function App() {
  const [v, setV] = useState('')
  return (
    <Screen
      title="FField — label & message"
      subtitle="Wrap a control with a label and helper line."
    >
      <Section>
        <FField label="Display name" message="Shown on your public profile.">
          <FieldInput value={v} onChangeText={setV} placeholder="Ada Lovelace" />
        </FField>
      </Section>
    </Screen>
  )
}
