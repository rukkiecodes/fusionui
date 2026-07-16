// FDivider — pure-RN mirror of @rukkiecodes/native FDivider. A hairline rule,
// horizontal (optionally inset) or vertical.
function FDivider({ vertical = false, inset = false, style }) {
  const line = withAlpha(color('on-surface'), 0.12)
  if (vertical) {
    return (
      <View
        style={[
          { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: line },
          style,
        ]}
      />
    )
  }
  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth, backgroundColor: line, marginLeft: inset ? 16 : 0 },
        style,
      ]}
    />
  )
}
