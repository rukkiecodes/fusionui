// FStat — pure-RN mirror of @rukkiecodes/native FStat. A headline metric with a
// label and optional icon.
function FStat({ value, label, icon, color: c = 'primary' }) {
  const accent = color(c)
  return (
    <View style={{ gap: 3 }}>
      {icon}
      <Text style={{ color: accent, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>
        {value}
      </Text>
      {label != null ? (
        <Text style={{ color: color('on-surface'), opacity: 0.6, fontSize: 13 }}>{label}</Text>
      ) : null}
    </View>
  )
}
