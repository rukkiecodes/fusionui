export default function App() {
  return (
    <Screen title="FCta — panel" subtitle="Title, copy and a springy action button.">
      <FCta
        title="Start building today"
        text="Ship a beautiful mobile app with the same design language as your web app."
      >
        <ActionButton onPress={() => {}}>Get started</ActionButton>
      </FCta>
    </Screen>
  )
}
