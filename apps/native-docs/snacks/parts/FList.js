// FList + FListItem — pure-RN mirror of @rukkiecodes/native. A surface list; each row
// takes leading/trailing slots and a title/subtitle, and presses when given onPress.
function FListItem({ leading, trailing, title, subtitle, onPress, children }) {
  const inner = (
    <View style={llstyles.item}>
      {leading}
      <View style={{ flex: 1 }}>
        {children ?? (
          <>
            {title != null ? <Text style={llstyles.title}>{title}</Text> : null}
            {subtitle != null ? <Text style={llstyles.subtitle}>{subtitle}</Text> : null}
          </>
        )}
      </View>
      {trailing}
    </View>
  )
  return onPress ? <Pressable onPress={onPress}>{inner}</Pressable> : inner
}

function FList({ divider = false, children }) {
  const items = React.Children.toArray(children)
  return (
    <View style={llstyles.list}>
      {items.map((c, i) => (
        <React.Fragment key={i}>
          {c}
          {divider && i < items.length - 1 ? <View style={llstyles.divider} /> : null}
        </React.Fragment>
      ))}
    </View>
  )
}

const llstyles = StyleSheet.create({
  list: {
    backgroundColor: color('surface'),
    borderRadius: T.radius.lg,
    ...shadowRest,
    shadowOpacity: 0.06,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  title: { color: color('on-surface'), fontSize: 16, fontWeight: '600' },
  subtitle: { color: withAlpha(color('on-surface'), 0.6), fontSize: 13.5, marginTop: 2 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color('surface-3'),
    marginLeft: 16,
  },
})
