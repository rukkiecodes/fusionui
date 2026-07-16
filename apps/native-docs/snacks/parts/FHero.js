// FHero — pure-RN mirror of @rukkiecodes/native FHero. The page-top banner: an
// eyebrow, a large title, a subtitle, and a slot for actions.
function FHero({ eyebrow, title, subtitle, children }) {
  return (
    <View style={{ gap: 12 }}>
      {eyebrow != null ? (
        <Text
          style={{ fontSize: 13, fontWeight: '600', letterSpacing: 0.4, color: color('primary') }}
        >
          {eyebrow}
        </Text>
      ) : null}
      {title != null ? (
        <Text
          style={{
            color: color('on-background'),
            fontSize: 30,
            fontWeight: '800',
            letterSpacing: -1,
            lineHeight: 36,
          }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle != null ? (
        <Text
          style={{ color: color('on-background'), opacity: 0.66, fontSize: 16, lineHeight: 24 }}
        >
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  )
}

function HeroButton({ children, onPress }) {
  const scale = useSharedValue(1)
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  return (
    <Animated.View style={[aStyle, { alignSelf: 'flex-start', marginTop: 4 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.96, { damping: 15, stiffness: 220 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 15, stiffness: 220 }))}
        style={{
          backgroundColor: color('primary'),
          paddingVertical: 12,
          paddingHorizontal: 22,
          borderRadius: T.radius.md,
        }}
      >
        <Text style={{ color: color('on-primary'), fontWeight: '600', fontSize: 15 }}>
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  )
}
