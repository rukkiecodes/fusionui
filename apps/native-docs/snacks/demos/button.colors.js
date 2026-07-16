export default function App() {
  return (
    <Screen
      title="FButton — colors"
      subtitle="Each theme colour resolves its fill and on-colour label."
    >
      <Panel caption="Colors">
        <FButton color="primary">Primary</FButton>
        <FButton color="success">Success</FButton>
        <FButton color="danger">Danger</FButton>
        <FButton color="warning">Warning</FButton>
      </Panel>
    </Screen>
  )
}
