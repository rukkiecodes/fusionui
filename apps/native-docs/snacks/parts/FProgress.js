// FProgress — pure-RN mirror of @rukkiecodes/native FProgress. Linear bar; the fill
// animates smoothly to each clamped value. Track width is measured so the fill can
// animate a real dp width (Reanimated animates numbers, not % strings).
const progressFraction = (value, max = 100) => {
  if (!(max > 0)) return 0
  const f = value / max
  return f < 0 ? 0 : f > 1 ? 1 : f
}

function FProgress({ value = 0, max = 100, color: c = 'primary', height = 6 }) {
  const accent = color(c)
  const track = withAlpha(color('on-surface'), 0.1)
  const [w, setW] = useState(0)
  const fill = useSharedValue(0)

  useEffect(() => {
    fill.value = withTiming(progressFraction(value, max) * w, { duration: T.motion.base })
  }, [value, max, w])

  const fillStyle = useAnimatedStyle(() => ({ width: fill.value }))

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      onLayout={e => setW(e.nativeEvent.layout.width)}
      style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' }}
    >
      <Animated.View
        style={[{ height: '100%', backgroundColor: accent, borderRadius: height / 2 }, fillStyle]}
      />
    </View>
  )
}
