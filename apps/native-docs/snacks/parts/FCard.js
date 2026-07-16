// FCard — pure-RN mirror of @rukkiecodes/native FCard. Soft-shadow surface with a
// spring press-lift when `onPress` is given; `flat` drops the shadow for a hairline.
function FCard({ flat = false, padding = 16, radius = T.radius.lg, onPress, children }) {
  const lift = useSharedValue(0)
  const pressable = typeof onPress === 'function'

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value * -4 }, { scale: 1 + lift.value * 0.01 }],
  }))

  const cardStyle = [
    {
      backgroundColor: flat ? color('surface-2') : color('surface'),
      borderRadius: radius,
      padding,
    },
    flat ? { borderWidth: StyleSheet.hairlineWidth, borderColor: color('surface-3') } : shadowRest,
  ]

  if (!pressable) {
    return <Animated.View style={[cardStyle, aStyle]}>{children}</Animated.View>
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (lift.value = withSpring(1, { damping: 16, stiffness: 220 }))}
      onPressOut={() => (lift.value = withTiming(0, { duration: T.motion.base }))}
    >
      <Animated.View style={[cardStyle, aStyle]}>{children}</Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', color: color('on-surface') },
  body: { marginTop: 8, fontSize: 14, lineHeight: 21, color: withAlpha(color('on-surface'), 0.8) },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: T.radius.sm,
    backgroundColor: color('primary'),
  },
  pillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: color('on-primary') },
})
