export default function App() {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  return (
    <Screen title="FForm — sign in" subtitle="Fields plus a springy submit button.">
      <View
        style={{
          backgroundColor: color('surface'),
          borderRadius: T.radius.lg,
          padding: 20,
          ...shadowRest,
          shadowOpacity: 0.06,
        }}
      >
        <FForm>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label="Password"
            value={pwd}
            onChangeText={setPwd}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
          />
          <SubmitButton onPress={() => {}}>Sign in</SubmitButton>
        </FForm>
      </View>
    </Screen>
  )
}
