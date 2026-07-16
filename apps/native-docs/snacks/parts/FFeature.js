// FFeature — pure-RN mirror of @rukkiecodes/native FFeature. An icon tile, a title
// and supporting copy — the marketing "feature" block.
function FFeature({ icon, title, text }) {
  return (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      {icon != null ? (
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: withAlpha(color('primary'), 0.1),
          }}
        >
          {icon}
        </View>
      ) : null}
      {title != null ? (
        <Text style={{ color: color('on-surface'), fontSize: 17, fontWeight: '700' }}>{title}</Text>
      ) : null}
      {text != null ? (
        <Text style={{ color: color('on-surface'), opacity: 0.65, fontSize: 14, lineHeight: 21 }}>
          {text}
        </Text>
      ) : null}
    </View>
  )
}
