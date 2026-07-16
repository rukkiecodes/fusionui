// FInput — pure-RN mirror of @rukkiecodes/native FInput / FField. Filled field:
// the 2px border crossfades surface-3 -> accent on focus (danger on error), lifts 1px.
function FInput({
  label,
  value,
  onChangeText,
  disabled = false,
  error,
  message,
  color: accentName = 'primary',
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  placeholder,
}) {
  const [focused, setFocused] = useState(false)
  const accent = color(accentName)
  const danger = color('danger')
  const onSurface = color('on-surface')

  const focus = useSharedValue(0)
  const borderStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? danger
      : interpolateColor(focus.value, [0, 1], [color('surface-3'), accent]),
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [color('surface-2'), color('surface-3')]
    ),
    transform: [{ translateY: -focus.value }],
  }))

  const messageColor = error ? danger : withAlpha(onSurface, 0.6)
  const messageText = error || message

  return (
    <View style={[styles.wrap, disabled && styles.wrapDisabled]}>
      {label ? <Text style={[styles.label, { color: onSurface }]}>{label}</Text> : null}
      <Animated.View style={[styles.control, borderStyle, focused && shadowRest]}>
        <TextInput
          editable={!disabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true)
            focus.value = withTiming(1, { duration: T.motion.base })
          }}
          onBlur={() => {
            setFocused(false)
            focus.value = withTiming(0, { duration: T.motion.base })
          }}
          placeholder={placeholder}
          placeholderTextColor={withAlpha(onSurface, 0.45)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          accessibilityLabel={label}
          style={[styles.input, { color: withAlpha(onSurface, 0.95) }]}
        />
      </Animated.View>
      {messageText ? (
        <Text style={[styles.msg, { color: messageColor }]}>{messageText}</Text>
      ) : (
        <View style={styles.msgSpacer} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', gap: 6 },
  wrapDisabled: { opacity: 0.5 },
  label: { fontSize: 13, fontWeight: '500' },
  control: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: T.radius.md,
  },
  input: { fontSize: 15, paddingVertical: 8 },
  msg: { fontSize: 12, paddingHorizontal: 4 },
  msgSpacer: { height: 14 },
})
