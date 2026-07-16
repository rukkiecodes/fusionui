export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color('surface-2'),
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text
        style={{ fontSize: 22, fontWeight: '700', color: color('on-surface'), marginBottom: 6 }}
      >
        LiquidGlassView
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          color: withAlpha(color('on-surface'), 0.65),
          textAlign: 'center',
          maxWidth: GW,
          marginBottom: 20,
        }}
      >
        A refractive translucent slab over a colourful backdrop — real content sits above it.
      </Text>
      <View style={[gstyles.canvasBox, shadowRest]}>
        <WithSkiaWeb
          getComponent={() => Promise.resolve({ default: GlassDemo })}
          fallback={<GlassFallback />}
        />
        <View pointerEvents="none" style={gstyles.overlay}>
          <Text style={gstyles.glassLabel}>Liquid glass</Text>
        </View>
      </View>
    </View>
  )
}
