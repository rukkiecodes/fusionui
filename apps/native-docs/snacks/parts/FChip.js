// FChip — pure-RN mirror of @rukkiecodes/native FChip. The button's variant/colour
// language in a smaller pill; a press spring when interactive.
const CHIP_METRICS = {
  small: { paddingVertical: 3, paddingHorizontal: 10, fontSize: 12 },
  medium: { paddingVertical: 5, paddingHorizontal: 14, fontSize: 13.5 },
}

function FChip({ variant = 'tonal', color: c = 'primary', size = 'medium', onPress, children }) {
  const base = color(c)
  const onBase = color('on-' + c)
  const m = CHIP_METRICS[size] || CHIP_METRICS.medium

  const container = {
    paddingVertical: m.paddingVertical,
    paddingHorizontal: m.paddingHorizontal,
    borderRadius: T.radius.pill,
    alignSelf: 'flex-start',
  }
  let labelColor = base
  switch (variant) {
    case 'tonal':
      container.backgroundColor = withAlpha(base, 0.14)
      break
    case 'outlined':
      container.backgroundColor = 'transparent'
      container.borderWidth = 1.5
      container.borderColor = withAlpha(base, 0.42)
      break
    case 'elevated':
      container.backgroundColor = base
      Object.assign(container, shadowRest, { shadowColor: base, shadowOpacity: 0.35 })
      labelColor = onBase
      break
    case 'flat':
      container.backgroundColor = base
      labelColor = onBase
      break
    default:
      container.backgroundColor = withAlpha(base, 0.14)
  }

  const scale = useSharedValue(1)
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() =>
          onPress && (scale.value = withSpring(0.94, { damping: 15, stiffness: 240 }))
        }
        onPressOut={() => onPress && (scale.value = withSpring(1, { damping: 15, stiffness: 240 }))}
        style={container}
      >
        <Text style={{ color: labelColor, fontSize: m.fontSize, fontWeight: '600' }}>
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  )
}
