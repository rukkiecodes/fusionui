export default function App() {
  return (
    <Screen
      title="FAlert — variants"
      subtitle="Seven fills, from the tonal default to an offset relief."
    >
      <View style={{ gap: 12 }}>
        <FAlert variant="default" type="info" title="Default" text="Tonal accent wash." />
        <FAlert variant="solid" type="success" title="Solid" text="Filled with the accent." />
        <FAlert variant="border" type="info" title="Border" text="Outlined, transparent fill." />
        <FAlert
          variant="shadow"
          type="warning"
          title="Shadow"
          text="Surface with a coloured shadow."
        />
        <FAlert variant="flat" type="error" title="Flat" text="Subtle neutral fill." />
        <FAlert
          variant="gradient"
          type="info"
          title="Gradient"
          text="Accent → violet, Skia-free."
        />
        <FAlert variant="relief" color="danger" title="Relief" text="Offset hard shadow." />
      </View>
    </Screen>
  )
}
