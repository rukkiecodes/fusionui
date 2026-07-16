// FSkeleton — pure-RN mirror of @rukkiecodes/native FSkeleton. A reduced-motion-aware
// opacity pulse standing in for content that hasn't loaded.
function FSkeleton({ width = '100%', height = 16, radius = 8, circle = false }) {
  const reduce = useReducedMotion()
  const o = useSharedValue(0.5)
  useEffect(() => {
    if (reduce) {
      o.value = 0.7
      return
    }
    o.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    )
  }, [reduce])
  const aStyle = useAnimatedStyle(() => ({ opacity: o.value }))
  const r = circle ? (typeof height === 'number' ? height / 2 : 999) : radius
  return (
    <Animated.View
      style={[
        { width, height, borderRadius: r, backgroundColor: withAlpha(color('on-surface'), 0.12) },
        aStyle,
      ]}
    />
  )
}
