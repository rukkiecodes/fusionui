// FForm — pure-RN mirror of @rukkiecodes/native FForm. A vertical container that
// spaces its fields evenly. Includes a small labelled input + submit button so the
// demo can show a real form.
function FForm({ gap = 16, children, style }) {
  return <View style={[{ gap }, style]}>{children}</View>
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text style={{ fontSize: 13, fontWeight: '500', color: color('on-surface') }}>{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
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
    </View>
  )
}

function SubmitButton({ children, onPress }) {
  const scale = useSharedValue(1)
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.97, { damping: 15, stiffness: 220 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 15, stiffness: 220 }))}
        style={{
          backgroundColor: color('primary'),
          paddingVertical: 13,
          borderRadius: T.radius.md,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: color('on-primary'), fontWeight: '600', fontSize: 15 }}>
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  )
}
