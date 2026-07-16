export default function App() {
  return (
    <Screen
      title="FAlert — types"
      subtitle="success · info · warning · error set the colour and glyph."
    >
      <View style={{ gap: 12 }}>
        <FAlert type="success" title="Saved" text="Your changes were saved." />
        <FAlert type="info" title="Heads up" text="A new version is available." />
        <FAlert type="warning" title="Storage almost full" text="Free up space to keep syncing." />
        <FAlert type="error" title="Upload failed" text="Check your connection and retry." />
      </View>
    </Screen>
  )
}
