export default function App() {
  return (
    <Screen title="FStat — single" subtitle="One metric with its label.">
      <View
        style={{
          backgroundColor: color('surface'),
          borderRadius: T.radius.lg,
          padding: 20,
          ...shadowRest,
          shadowOpacity: 0.06,
        }}
      >
        <FStat value="12,480" label="Monthly active users" />
      </View>
    </Screen>
  )
}
