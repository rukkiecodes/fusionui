// FAlert — pure-RN mirror of @rukkiecodes/native FAlert. variant / color / type /
// title / text / icon / closable / progress; Reanimated dismiss + animated bar.
const mix = (h1, h2, t) => {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
  const a = p(h1),
    b = p(h2)
  return (
    '#' +
    a
      .map((v, i) =>
        Math.round(v + (b[i] - v) * t)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

const TYPE_COLOR = { success: 'success', info: 'primary', warning: 'warning', error: 'danger' }
const TYPE_GLYPH = { success: '✓', info: 'ℹ', warning: '⚠', error: '✕' }
const clamp = n => Math.max(0, Math.min(100, Number(n) || 0))

function FAlert({
  variant = 'default',
  color: colorProp,
  type,
  title,
  text,
  icon,
  closable = false,
  progress = 0,
  onClose,
  children,
}) {
  const accentName = colorProp || (type ? TYPE_COLOR[type] : 'primary')
  const accent = color(accentName)
  const onAccent = color('on-' + accentName) || '#ffffff'
  const radius = T.radius.md
  const [closed, setClosed] = useState(false)

  const shown = useSharedValue(1)
  const finish = () => {
    setClosed(true)
    onClose && onClose()
  }
  const dismiss = () => {
    shown.value = withTiming(
      0,
      { duration: T.motion.base, reduceMotion: ReduceMotion.System },
      done => {
        'worklet'
        if (done) runOnJS(finish)()
      }
    )
  }
  const outerStyle = useAnimatedStyle(() => ({
    opacity: shown.value,
    transform: [{ translateY: (1 - shown.value) * -6 }],
  }))

  const prog = useSharedValue(clamp(progress))
  useEffect(() => {
    prog.value = withTiming(clamp(progress), {
      duration: T.motion.base,
      reduceMotion: ReduceMotion.System,
    })
  }, [progress])
  const barStyle = useAnimatedStyle(() => ({ width: `${prog.value}%` }))

  if (closed) return null

  const onColor = variant === 'solid' || variant === 'gradient' || variant === 'relief'
  const fg = onColor ? onAccent : accent
  const hasBar =
    variant === 'default' || variant === 'solid' || variant === 'shadow' || variant === 'flat'
  const fullRadius = variant === 'gradient' || variant === 'relief'

  const surface = { borderRadius: radius }
  if (!fullRadius) {
    surface.borderTopLeftRadius = 0
    surface.borderBottomLeftRadius = 0
  }
  let gradient = null
  if (variant === 'default') surface.backgroundColor = withAlpha(accent, 0.1)
  else if (variant === 'solid') surface.backgroundColor = accent
  else if (variant === 'border')
    Object.assign(surface, { backgroundColor: 'transparent', borderWidth: 1, borderColor: accent })
  else if (variant === 'shadow')
    Object.assign(surface, {
      backgroundColor: T.colors.surface,
      shadowColor: accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 9,
      elevation: 4,
    })
  else if (variant === 'flat') surface.backgroundColor = withAlpha(T.colors['on-surface'], 0.04)
  else if (variant === 'gradient') {
    surface.backgroundColor = accent
    gradient = [accent, mix(accent, '#c026ff', 0.45)]
  } else if (variant === 'relief')
    Object.assign(surface, {
      backgroundColor: accent,
      shadowColor: accent,
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 0,
      elevation: 4,
    })

  let iconNode = null
  if (icon !== false) {
    if (icon != null && icon !== true)
      iconNode =
        typeof icon === 'string' ? <Text style={[ui.iconGlyph, { color: fg }]}>{icon}</Text> : icon
    else if (type) iconNode = <Text style={[ui.iconGlyph, { color: fg }]}>{TYPE_GLYPH[type]}</Text>
  }

  return (
    <Animated.View style={[ui.outer, outerStyle]}>
      <View style={[ui.body, surface]}>
        {gradient ? (
          <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : null}
        {hasBar ? (
          <View
            style={[
              ui.bar,
              { backgroundColor: variant === 'solid' ? withAlpha(onAccent, 0.4) : accent },
            ]}
          />
        ) : null}
        <View style={ui.row}>
          {iconNode ? <View style={ui.iconCol}>{iconNode}</View> : null}
          <View style={ui.content}>
            {title ? <Text style={[ui.title, { color: fg }]}>{title}</Text> : null}
            {children ? (
              children
            ) : text ? (
              <Text style={[ui.bodyText, { color: fg }]}>{text}</Text>
            ) : null}
          </View>
          {closable ? (
            <Pressable onPress={dismiss} style={ui.close} accessibilityLabel="Close">
              <Text style={[ui.closeGlyph, { color: fg }]}>✕</Text>
            </Pressable>
          ) : null}
        </View>
        {clamp(progress) > 0 ? (
          <View
            style={[
              ui.progressTrack,
              {
                backgroundColor: withAlpha(onColor ? onAccent : accent, 0.2),
                borderBottomRightRadius: radius,
                borderBottomLeftRadius: fullRadius ? radius : 0,
              },
            ]}
          >
            <Animated.View style={[ui.progressBar, { backgroundColor: fg }, barStyle]} />
          </View>
        ) : null}
      </View>
    </Animated.View>
  )
}

const ui = StyleSheet.create({
  outer: { width: '100%' },
  body: { position: 'relative', overflow: 'visible', minHeight: 48, justifyContent: 'center' },
  bar: { position: 'absolute', top: 0, left: 0, width: 3, bottom: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconCol: { width: 24, alignItems: 'center', justifyContent: 'center' },
  iconGlyph: { fontSize: 18, fontWeight: '700' },
  content: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontWeight: '600' },
  bodyText: { fontSize: 14, lineHeight: 20 },
  close: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: { fontSize: 15, fontWeight: '600' },
  progressTrack: { height: 3, width: '100%', overflow: 'hidden' },
  progressBar: { height: 3 },
})
