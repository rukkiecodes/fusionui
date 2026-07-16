// FField — pure-RN mirror of @rukkiecodes/native FField. The label + message/error
// shell that wraps any control; `required` adds an asterisk.
function FField({ label, message, error, required, children }) {
  const onSurface = color('on-surface')
  const msg = error || message
  return (
    <View style={{ alignSelf: 'stretch', gap: 6 }}>
      {label ? (
        <Text style={{ fontSize: 13, fontWeight: '500', color: onSurface }}>
          {label}
          {required ? <Text style={{ color: color('danger') }}> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {msg ? (
        <Text
          style={{
            fontSize: 12,
            paddingHorizontal: 4,
            color: error ? color('danger') : withAlpha(onSurface, 0.6),
          }}
        >
          {msg}
        </Text>
      ) : null}
    </View>
  )
}

// A plain filled control the FField demos can wrap.
function FieldInput(props) {
  const [focused, setFocused] = useState(false)
  return (
    <TextInput
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholderTextColor={withAlpha(color('on-surface'), 0.45)}
      style={{
        minHeight: 44,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: T.radius.md,
        borderColor: focused ? color('primary') : color('surface-3'),
        backgroundColor: color('surface-2'),
        color: withAlpha(color('on-surface'), 0.95),
        fontSize: 15,
      }}
    />
  )
}
