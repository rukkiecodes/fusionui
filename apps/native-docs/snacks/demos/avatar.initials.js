export default function App() {
  return (
    <Screen title="FAvatar — initials" subtitle="Coloured fallback initials from a name.">
      <Panel caption="Initials">
        <FAvatar text="Ada Lovelace" />
        <FAvatar text="Grace Hopper" color="success" />
        <FAvatar text="Alan Turing" color="danger" />
        <FAvatar text="Katherine Johnson" color="secondary" />
      </Panel>
    </Screen>
  )
}
