// FRadio + FRadioGroup — pure-RN mirror of @rukkiecodes/native. FRadioGroup takes
// options and emits the selected value; FRadio draws one dot-in-ring control.
function FRadio({
  selected = false,
  onPress,
  color: c = 'primary',
  disabled = false,
  label,
  size = 22,
}) {
  const accent = color(c)
  const border = withAlpha(color('on-surface'), 0.3)
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1 }]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: selected ? accent : border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{
              width: size * 0.5,
              height: size * 0.5,
              borderRadius: size * 0.25,
              backgroundColor: accent,
            }}
          />
        ) : null}
      </View>
      {label != null ? (
        <Text style={{ color: color('on-surface'), fontSize: 15 }}>{label}</Text>
      ) : null}
    </Pressable>
  )
}

function FRadioGroup({ value, onValueChange, options, color: c, disabled, gap = 12 }) {
  return (
    <View accessibilityRole="radiogroup" style={{ gap }}>
      {options.map(o => (
        <FRadio
          key={o.value}
          label={o.label}
          color={c}
          disabled={disabled}
          selected={value === o.value}
          onPress={() => onValueChange && onValueChange(o.value)}
        />
      ))}
    </View>
  )
}
