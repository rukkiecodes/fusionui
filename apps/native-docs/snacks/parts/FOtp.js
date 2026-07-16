// FOtp — pure-RN mirror of @rukkiecodes/native FOtp. A hidden input drives a row of
// cells; the next empty cell is highlighted with the accent.
const otpCells = (value, length) => {
  const clean = (value ?? '').slice(0, length)
  const chars = Array.from({ length }, (_, i) => clean[i] ?? '')
  return { chars, activeIndex: Math.min(clean.length, length - 1) }
}
const sanitizeOtp = (input, length) => (input ?? '').replace(/\D/g, '').slice(0, length)

function FOtp({ value = '', onChangeText, length = 6, color: c = 'primary' }) {
  const accent = color(c)
  const border = withAlpha(color('on-surface'), 0.14)
  const inputRef = useRef(null)
  const { chars, activeIndex } = otpCells(value, length)
  return (
    <View>
      <Pressable
        onPress={() => inputRef.current && inputRef.current.focus()}
        style={{ flexDirection: 'row', gap: 8 }}
      >
        {chars.map((ch, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              maxWidth: 52,
              height: 56,
              borderRadius: T.radius.md,
              borderWidth: 1.5,
              borderColor: i === activeIndex && value.length < length ? accent : border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '700', color: color('on-surface') }}>
              {ch}
            </Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={t => onChangeText && onChangeText(sanitizeOtp(t, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
      />
    </View>
  )
}
