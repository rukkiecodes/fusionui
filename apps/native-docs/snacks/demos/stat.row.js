export default function App() {
  return (
    <Screen title="FStat — stats row" subtitle="Several metrics across a card.">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: color('surface'),
          borderRadius: T.radius.lg,
          padding: 20,
          ...shadowRest,
          shadowOpacity: 0.06,
        }}
      >
        <FStat value="98%" label="Uptime" color="success" />
        <FStat value="1.2s" label="Avg. load" color="primary" />
        <FStat value="42" label="Open issues" color="danger" />
      </View>
    </Screen>
  )
}
