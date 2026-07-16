// Shared snack "kit" — inlined verbatim at the top of every generated snack (after
// the import header the generator prepends). Declarations only: NO imports, and it
// owns the `T`/`color`/`withAlpha`/`shadowRest` token layer plus the demo chrome
// (Screen / Panel / Section / Row) so each per-variant demo stays a few lines.
//
// Styling note: the token values here are inlined from @rukkiecodes/tokens (native
// output). Snack can't import the source-shipped package, so the demos mirror it —
// but every number/colour still traces to one token source.

// ----TOKENS START----
const T = {
  colors: {
    primary: '#195bff',
    'on-primary': '#ffffff',
    secondary: '#7d5fff',
    'on-secondary': '#ffffff',
    success: '#46c93a',
    'on-success': '#ffffff',
    danger: '#ff4757',
    'on-danger': '#ffffff',
    warning: '#ffba00',
    'on-warning': '#1e1e1e',
    surface: '#ffffff',
    'on-surface': '#2c3e50',
    background: '#ffffff',
    'on-background': '#2c3e50',
    'surface-2': '#f4f7f8',
    'surface-3': '#e9eef1',
  },
  radius: { sm: 8, md: 12, lg: 20, xl: 28, pill: 9999 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32 },
  motion: { fast: 150, base: 250 },
}
const color = c => T.colors[c] || c
const withAlpha = (hex, a) =>
  /^#[0-9a-f]{6}$/i.test(hex)
    ? hex +
      Math.round(a * 255)
        .toString(16)
        .padStart(2, '0')
    : hex
const shadowRest = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 4,
}
// ----TOKENS END----

// Full-screen scaffold: a soft surface-2 page with a title + subtitle header.
function Screen({ title, subtitle, children }) {
  return (
    <SafeAreaView style={K.screen}>
      <ScrollView contentContainerStyle={K.scroll}>
        {title ? <Text style={K.h1}>{title}</Text> : null}
        {subtitle ? <Text style={K.sub}>{subtitle}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

// A labelled group with no surface — for form fields and free-standing demos.
function Section({ caption, children }) {
  return (
    <View style={K.section}>
      {caption ? <Text style={K.sectionCap}>{caption}</Text> : null}
      {children}
    </View>
  )
}

// A labelled group inside an elevated surface card — for chips/buttons/rows.
function Panel({ caption, children, row = true }) {
  return (
    <View style={K.panel}>
      {caption ? <Text style={K.panelCap}>{caption}</Text> : null}
      <View style={row ? K.panelRow : null}>{children}</View>
    </View>
  )
}

// A space-between list row (label/caption on the left, control on the right).
function Row({ label, caption, children, onPress }) {
  const body = (
    <>
      <View style={K.rowText}>
        {label ? <Text style={K.rowLabel}>{label}</Text> : null}
        {caption ? <Text style={K.rowCaption}>{caption}</Text> : null}
      </View>
      {children}
    </>
  )
  return onPress ? (
    <Pressable onPress={onPress} style={K.row}>
      {body}
    </Pressable>
  ) : (
    <View style={K.row}>{body}</View>
  )
}

const Divider = () => <View style={K.divider} />

const K = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color('surface-2') },
  scroll: { padding: 20, paddingBottom: 48 },
  h1: { fontSize: 28, fontWeight: '800', color: color('on-surface'), letterSpacing: -0.5 },
  sub: {
    fontSize: 13.5,
    lineHeight: 19,
    color: withAlpha(color('on-surface'), 0.6),
    marginTop: 4,
    marginBottom: 22,
  },
  section: { marginBottom: 22 },
  sectionCap: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: withAlpha(color('on-surface'), 0.5),
    marginBottom: 10,
  },
  panel: {
    backgroundColor: color('surface'),
    borderRadius: T.radius.lg,
    padding: 18,
    marginBottom: 16,
    ...shadowRest,
    shadowOpacity: 0.06,
  },
  panelCap: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: withAlpha(color('on-surface'), 0.5),
    marginBottom: 14,
  },
  panelRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  rowText: { flex: 1, paddingRight: 16 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: color('on-surface') },
  rowCaption: { fontSize: 13, color: withAlpha(color('on-surface'), 0.55), marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: color('surface-3') },
})
