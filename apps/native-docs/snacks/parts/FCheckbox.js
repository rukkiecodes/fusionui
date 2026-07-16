// FCheckbox — pure-RN mirror of @rukkiecodes/native FCheckbox. Drawn check, with
// the checkbox accessibility role + checked/disabled state.
function FCheckbox({
  value = false,
  onValueChange,
  color: c = 'primary',
  disabled = false,
  label,
  size = 22,
}) {
  const accent = color(c)
  const on = color('on-' + c)
  const border = withAlpha(color('on-surface'), 0.3)

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1 }]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: value ? accent : 'transparent',
          borderWidth: value ? 0 : 2,
          borderColor: border,
        }}
      >
        {value ? (
          <Text style={{ color: on, fontSize: size * 0.62, fontWeight: '900', lineHeight: size }}>
            ✓
          </Text>
        ) : null}
      </View>
      {label != null ? (
        <Text style={{ color: color('on-surface'), fontSize: 15 }}>{label}</Text>
      ) : null}
    </Pressable>
  )
}
