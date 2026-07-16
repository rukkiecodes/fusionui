// LiquidGlassView — pure-RN mirror of @rukkiecodes/native's signature effect. On the
// web this renders through Skia's CanvasKit (WithSkiaWeb); on device it is the GPU
// BackdropFilter / iOS 26 UIGlassEffect. A refractive translucent slab over a live
// backdrop — the same intent as engine/liquid-glass (SDF → Snell refraction).
const GW = 300
const GH = 340
const GSX = 40
const GSY = 60
const GSW = GW - GSX * 2
const GSH = GH - GSY * 2
const GRADIUS = 24

function GlassDemo() {
  const Sk = require('@shopify/react-native-skia')
  const { Canvas, RoundedRect, Fill, LinearGradient, vec, Blur, Group, Circle } = Sk
  return (
    <Canvas style={{ width: GW, height: GH }}>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(GW, GH)}
          colors={[color('primary'), '#c026ff', color('danger')]}
        />
      </Fill>
      <Group>
        <Blur blur={18} />
        <Circle cx={GW * 0.78} cy={GH * 0.22} r={64} color={withAlpha('#ffffff', 0.35)} />
        <Circle cx={GW * 0.2} cy={GH * 0.8} r={78} color={withAlpha(color('warning'), 0.45)} />
      </Group>
      <Group>
        <Blur blur={12} />
        <RoundedRect
          x={GSX}
          y={GSY}
          width={GSW}
          height={GSH}
          r={GRADIUS}
          color={withAlpha('#ffffff', 0.18)}
        />
      </Group>
      <RoundedRect
        x={GSX}
        y={GSY}
        width={GSW}
        height={GSH}
        r={GRADIUS}
        style="stroke"
        strokeWidth={1.2}
        color={withAlpha('#ffffff', 0.55)}
      />
      <RoundedRect
        x={GSX + 1.5}
        y={GSY + 1.5}
        width={GSW - 3}
        height={GSH * 0.4}
        r={GRADIUS - 2}
        style="stroke"
        strokeWidth={1}
        color={withAlpha('#ffffff', 0.28)}
      />
    </Canvas>
  )
}

function GlassFallback() {
  return (
    <View style={[gstyles.canvasBox, gstyles.center]}>
      <Text style={gstyles.loading}>Loading Skia…</Text>
    </View>
  )
}

const gstyles = StyleSheet.create({
  canvasBox: {
    width: GW,
    height: GH,
    borderRadius: T.radius.lg,
    backgroundColor: color('surface-3'),
    overflow: 'hidden',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: { fontSize: 14, color: withAlpha(color('on-surface'), 0.6) },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  glassLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: color('on-primary'),
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
})
