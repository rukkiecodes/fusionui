export default function App() {
  return (
    <Screen title="FHero — banner" subtitle="Eyebrow, title, subtitle and a CTA.">
      <FHero
        eyebrow="REACT NATIVE · EXPO"
        title="Build once, feel native"
        subtitle="FusionUI brings the same components, tokens and motion to the phone."
      >
        <HeroButton onPress={() => {}}>Explore components</HeroButton>
      </FHero>
    </Screen>
  )
}
