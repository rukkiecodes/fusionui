function Dot({ label, bg }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{label}</Text>
    </View>
  )
}

const Chevron = () => (
  <Text style={{ color: withAlpha(color('on-surface'), 0.4), fontSize: 22 }}>›</Text>
)

export default function App() {
  return (
    <Screen
      title="FList — leading & trailing"
      subtitle="Avatars, values and chevrons in the slots."
    >
      <FList divider>
        <FListItem
          onPress={() => {}}
          leading={<Dot label="AL" bg={color('primary')} />}
          title="Ada Lovelace"
          subtitle="Online"
          trailing={<Chevron />}
        />
        <FListItem
          onPress={() => {}}
          leading={<Dot label="GH" bg={color('success')} />}
          title="Grace Hopper"
          subtitle="Last seen 2h ago"
          trailing={<Chevron />}
        />
        <FListItem
          onPress={() => {}}
          leading={<Dot label="AT" bg={color('danger')} />}
          title="Alan Turing"
          subtitle="Away"
          trailing={<Chevron />}
        />
      </FList>
    </Screen>
  )
}
