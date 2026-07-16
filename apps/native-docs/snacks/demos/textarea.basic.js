export default function App() {
  const [v, setV] = useState('')
  return (
    <Screen title="FTextarea — basic" subtitle="A labelled multiline field with a helper line.">
      <Section>
        <FTextarea
          label="Bio"
          placeholder="Tell us about yourself…"
          value={v}
          onChangeText={setV}
          message="A sentence or two is plenty."
          rows={5}
        />
      </Section>
    </Screen>
  )
}
