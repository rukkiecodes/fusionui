export default function App() {
  const [active, setActive] = useState('home')
  const links = [
    { id: 'home', label: 'Home', glyph: '⌂' },
    { id: 'search', label: 'Search', glyph: '⌕' },
    { id: 'profile', label: 'Profile', glyph: '☺' },
    { id: 'settings', label: 'Settings', glyph: '⚙' },
  ]
  return (
    <FShell
      navbarHeight={56}
      sidebarWidth={200}
      cornerSize={24}
      navbar={
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
            gap: 10,
          }}
        >
          <View
            style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: color('primary') }}
          />
          <Text style={{ fontSize: 17, fontWeight: '800', color: color('on-surface') }}>
            FusionUI
          </Text>
        </View>
      }
      sidebar={
        <View style={{ flex: 1, paddingTop: 16, paddingHorizontal: 12, gap: 4 }}>
          {links.map(l => (
            <Pressable
              key={l.id}
              onPress={() => setActive(l.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 11,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor:
                  active === l.id ? withAlpha(color('primary'), 0.12) : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: active === l.id ? color('primary') : withAlpha(color('on-surface'), 0.6),
                }}
              >
                {l.glyph}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: active === l.id ? '700' : '500',
                  color: active === l.id ? color('primary') : color('on-surface'),
                }}
              >
                {l.label}
              </Text>
            </Pressable>
          ))}
        </View>
      }
    >
      <View style={{ flex: 1, padding: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '800',
            color: color('on-surface'),
            textTransform: 'capitalize',
          }}
        >
          {active}
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            lineHeight: 21,
            color: withAlpha(color('on-surface'), 0.65),
          }}
        >
          The navbar and sidebar form a tinted frame; the content nestles into the shell with the
          convex goo corner (top-left) drawn on the GPU with Skia — the same junction as the web
          shell.
        </Text>
      </View>
    </FShell>
  )
}
