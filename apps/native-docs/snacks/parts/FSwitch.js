// FSwitch — pure-RN mirror of @rukkiecodes/native FSwitch. Springy toggle: the
// track crossfades off -> accent, the thumb translates with a touch of overshoot.
const SPRING = { damping: 16, stiffness: 220, mass: 0.7 }

function FSwitch({ value = false, onValueChange, color: c = 'primary', disabled = false }) {
  const accent = color(c)
  const off = color('surface-3')

  const v = useSharedValue(value ? 1 : 0)
  useEffect(() => {
    v.value = withSpring(value ? 1 : 0, SPRING)
  }, [value])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], [off, accent]),
  }))
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: 2 + v.value * 20 }] }))

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange && onValueChange(!value)}
      style={disabled ? styles.disabled : null}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.5 },
  track: { width: 46, height: 26, borderRadius: 13, justifyContent: 'center' },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color('surface'),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
})
