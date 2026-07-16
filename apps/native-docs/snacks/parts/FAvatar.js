// FAvatar — pure-RN mirror of @rukkiecodes/native FAvatar. Image (clipped to shape)
// or coloured initials; rounded square by default, or a full circle.
const initials = name => {
  if (!name) return ''
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

function FAvatar({ image, text, color: c = 'primary', size = 44, circle = false, style }) {
  const radius = circle ? size / 2 : T.radius.md
  const base = { width: size, height: size, borderRadius: radius, overflow: 'hidden' }

  if (image) {
    return (
      <View style={[base, style]}>
        <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
      </View>
    )
  }

  const bg = color(c)
  const fg = color('on-' + c)
  return (
    <View
      style={[base, { backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Text style={{ color: fg, fontSize: size * 0.38, fontWeight: '700' }}>{initials(text)}</Text>
    </View>
  )
}
