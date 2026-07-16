// FBadge — pure-RN mirror of @rukkiecodes/native FBadge. A count/status marker that
// pins to the top-right of the element it wraps; numbers cap at `max`.
const badgeLabel = (content, max = 99) => {
  if (content == null) return ''
  if (typeof content === 'number') return content > max ? max + '+' : String(content)
  return content
}

function FBadge({ content, color: c = 'danger', dot = false, max = 99, children }) {
  const bg = color(c)
  const fg = color('on-' + c)
  const label = badgeLabel(content, max)
  const pinned = { position: 'absolute', top: -6, right: -6 }

  const badge = dot ? (
    <View
      style={[
        { width: 10, height: 10, borderRadius: 5, backgroundColor: bg },
        children ? pinned : null,
      ]}
    />
  ) : (
    <View
      style={[
        {
          minWidth: 18,
          height: 18,
          paddingHorizontal: 5,
          borderRadius: 9,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        children ? pinned : null,
      ]}
    >
      <Text style={{ color: fg, fontSize: 11, fontWeight: '800' }}>{label}</Text>
    </View>
  )

  if (!children) return badge
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      {children}
      {badge}
    </View>
  )
}
