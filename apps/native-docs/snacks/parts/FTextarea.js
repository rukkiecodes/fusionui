// FTextarea — pure-RN mirror of @rukkiecodes/native FTextarea. A multiline field on
// the FField shell: label, message/error, and a growing-height text area.
function FTextarea({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  message,
  required,
  rows = 4,
}) {
  const [focused, setFocused] = useState(false)
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
      <TextInput
        multiline
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={withAlpha(onSurface, 0.45)}
        style={{
          minHeight: rows * 22,
          textAlignVertical: 'top',
          padding: 12,
          borderWidth: 2,
          borderRadius: T.radius.md,
          borderColor: error ? color('danger') : focused ? color('primary') : color('surface-3'),
          backgroundColor: color('surface-2'),
          color: withAlpha(onSurface, 0.95),
          fontSize: 15,
          lineHeight: 21,
        }}
      />
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
