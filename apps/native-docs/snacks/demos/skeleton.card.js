export default function App() {
  return (
    <Screen
      title="FSkeleton — card placeholder"
      subtitle="A media + text card, faked while loading."
    >
      <View
        style={{
          backgroundColor: color('surface'),
          borderRadius: T.radius.lg,
          padding: 16,
          gap: 12,
          ...shadowRest,
          shadowOpacity: 0.06,
        }}
      >
        <FSkeleton height={150} radius={14} />
        <FSkeleton width="80%" height={16} />
        <FSkeleton width="55%" height={13} />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
          <FSkeleton width={84} height={32} radius={16} />
          <FSkeleton width={84} height={32} radius={16} />
        </View>
      </View>
    </Screen>
  )
}
