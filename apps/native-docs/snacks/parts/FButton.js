// FButton — pure-RN mirror of @rukkiecodes/native FButton. Same contract:
// variant, color, size, loading, disabled, block. Press spring + dual-ring loader.

const SIZES = {
  small: { padV: 6, padH: 12, font: 13, radius: 9 },
  default: { padV: 10, padH: 18, font: 15, radius: 12 },
  large: { padV: 14, padH: 24, font: 17, radius: 15 },
}

// Mix two #rrggbb colors (t in 0..1) — the gradient variant runs base -> #c026ff.
const mix = (h1, h2, t) => {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const a = p(h1),
    b = p(h2)
  const r = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return '#' + r.map(v => v.toString(16).padStart(2, '0')).join('')
}

// Two overlaid rings spinning at slightly different speeds — the loading state.
function DualRingLoader({ ringColor }) {
  const a = useSharedValue(0)
  const b = useSharedValue(0)
  useEffect(() => {
    a.value = withRepeat(withTiming(360, { duration: 600, easing: Easing.linear }), -1, false)
    b.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1, false)
  }, [a, b])
  const aStyle = useAnimatedStyle(() => ({ transform: [{ rotate: a.value + 'deg' }] }))
  const bStyle = useAnimatedStyle(() => ({ transform: [{ rotate: b.value + 'deg' }] }))
  return (
    <View style={styles.loaderBox}>
      <Animated.View
        style={[
          styles.ring,
          {
            borderColor: ringColor,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
          },
          aStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          styles.ringDotted,
          {
            borderColor: withAlpha(/^#[0-9a-f]{6}$/i.test(ringColor) ? ringColor : '#ffffff', 0.6),
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
          },
          bStyle,
        ]}
      />
    </View>
  )
}

function FButton({
  variant = 'elevated',
  color: colorName = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  block = false,
  onPress,
  children,
}) {
  const base = color(colorName)
  const onBase = color('on-' + colorName)
  const sz = SIZES[size] || SIZES.default

  const scale = useSharedValue(1)
  const press = useSharedValue(0)
  const wrapStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  const pillStyle = useAnimatedStyle(() => ({ opacity: press.value }))

  const container = {
    paddingVertical: sz.padV,
    paddingHorizontal: sz.padH,
    borderRadius: sz.radius,
    alignSelf: block ? 'stretch' : 'flex-start',
  }
  let labelColor = onBase
  let useGradient = false
  let pillColor = null

  switch (variant) {
    case 'elevated':
      container.backgroundColor = base
      Object.assign(container, shadowRest, { shadowColor: base, shadowOpacity: 0.4 })
      break
    case 'flat':
      container.backgroundColor = base
      break
    case 'tonal':
      container.backgroundColor = withAlpha(base, 0.15)
      labelColor = base
      break
    case 'outlined':
      container.backgroundColor = 'transparent'
      container.borderWidth = 2
      container.borderColor = base
      labelColor = base
      break
    case 'text':
      container.backgroundColor = 'transparent'
      labelColor = base
      pillColor = withAlpha(base, 0.12)
      break
    case 'gradient':
      container.backgroundColor = base
      useGradient = true
      labelColor = '#ffffff'
      break
    default:
      container.backgroundColor = base
  }

  const ringColor =
    variant === 'tonal' || variant === 'outlined' || variant === 'text' ? base : onBase

  return (
    <Animated.View style={[block && styles.blockWrap, wrapStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 220 })
          if (variant === 'text') press.value = withTiming(1, { duration: T.motion.fast })
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 220 })
          if (variant === 'text') press.value = withTiming(0, { duration: T.motion.base })
        }}
        style={[styles.base, container, disabled && styles.disabled]}
      >
        {useGradient ? (
          <View style={[StyleSheet.absoluteFill, { borderRadius: sz.radius, overflow: 'hidden' }]}>
            <LinearGradient
              colors={[base, mix(base, '#c026ff', 0.5)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}

        {pillColor ? (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: sz.radius, backgroundColor: pillColor },
              pillStyle,
            ]}
          />
        ) : null}

        {loading ? (
          <DualRingLoader ringColor={ringColor} />
        ) : typeof children === 'string' ? (
          <Text style={{ color: labelColor, fontSize: sz.font, fontWeight: '600' }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blockWrap: { alignSelf: 'stretch', width: '100%' },
  disabled: { opacity: 0.5 },
  loaderBox: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  ringDotted: { borderStyle: 'dotted' },
})
