export default function App() {
  return (
    <Screen
      title="FButton — sizes"
      subtitle="small · default · large — padding, font and radius scale together."
    >
      <Panel caption="Sizes">
        <FButton size="small">Small</FButton>
        <FButton size="default">Default</FButton>
        <FButton size="large">Large</FButton>
      </Panel>
    </Screen>
  )
}
