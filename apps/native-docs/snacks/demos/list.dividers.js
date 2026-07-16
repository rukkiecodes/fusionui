export default function App() {
  return (
    <Screen title="FList — dividers" subtitle="Inset hairlines between rows.">
      <FList divider>
        <FListItem title="Profile" subtitle="Name, photo, bio" />
        <FListItem title="Notifications" subtitle="Push, email, SMS" />
        <FListItem title="Privacy" subtitle="Visibility and data" />
        <FListItem title="About" subtitle="Version 1.0.0" />
      </FList>
    </Screen>
  )
}
