export default function App() {
  return (
    <Screen title="FSkeleton — shapes" subtitle="Lines and a circle, pulsing together.">
      <Panel caption="Placeholders" row={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <FSkeleton width={48} height={48} circle />
          <View style={{ flex: 1, gap: 8 }}>
            <FSkeleton width="70%" height={14} />
            <FSkeleton width="45%" height={12} />
          </View>
        </View>
        <View style={{ height: 20 }} />
        <View style={{ gap: 8 }}>
          <FSkeleton height={12} />
          <FSkeleton width="90%" height={12} />
          <FSkeleton width="60%" height={12} />
        </View>
      </Panel>
    </Screen>
  )
}
