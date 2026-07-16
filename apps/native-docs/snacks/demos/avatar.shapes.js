export default function App() {
  return (
    <Screen title="FAvatar — shapes & sizes" subtitle="Rounded square vs circle, across sizes.">
      <Panel caption="Shapes & sizes">
        <FAvatar text="AB" size={32} />
        <FAvatar text="AB" size={44} />
        <FAvatar text="AB" size={56} circle />
        <FAvatar text="AB" size={64} circle color="secondary" />
      </Panel>
    </Screen>
  )
}
