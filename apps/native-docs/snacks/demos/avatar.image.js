export default function App() {
  return (
    <Screen title="FAvatar — image" subtitle="A remote image, clipped to the shape.">
      <Panel caption="Image">
        <FAvatar image="https://i.pravatar.cc/120?img=12" size={56} />
        <FAvatar image="https://i.pravatar.cc/120?img=32" size={56} circle />
        <FAvatar image="https://i.pravatar.cc/120?img=5" size={72} circle />
      </Panel>
    </Screen>
  )
}
