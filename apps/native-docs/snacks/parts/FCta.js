// FCta — pure-RN mirror of @rukkiecodes/native FCta. A centred call-to-action panel
// (xl radius, tonal primary wash) with a title, copy and an action slot.
function FCta({ title, text, children }) {
  return (
    <View
      style={{
        padding: 28,
        borderRadius: T.radius.xl,
        backgroundColor: withAlpha(color('primary'), 0.06),
        gap: 12,
        alignItems: 'center',
      }}
    >
      {title != null ? (
        <Text
          style={{
            color: color('on-surface'),
            fontSize: 20,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      ) : null}
      {text != null ? (
        <Text
          style={{
            color: color('on-surface'),
            opacity: 0.65,
            fontSize: 14,
            lineHeight: 21,
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      ) : null}
      {children}
    </View>
  )
}

// A filled action button for the CTA/hero demos.
function ActionButton({ children, onPress }) {
  const scale = useSharedValue(1)
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  return (
    <Animated.View style={aStyle}>
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
