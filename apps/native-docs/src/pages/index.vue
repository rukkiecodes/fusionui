<script setup lang="ts">
// Home of the mobile docs — the components-and-styles hub. Primary CTA into the
// full component reference; secondary into install.
import { components } from '@/manifest'

const features = [
  {
    icon: 'smartphone',
    title: 'Component parity',
    body: 'The same names, props, variants and states as the web — FButton, FCard, FInput, FSwitch and more. A component feels identical on both platforms.',
  },
  {
    icon: 'layers',
    title: 'Liquid glass, on the GPU',
    body: 'The signature effect via Skia (SKSL) — or the real UIGlassEffect on iOS 26. The same SDF → Snell refraction engine as the web, running per pixel.',
  },
  {
    icon: 'sliders',
    title: 'Tokens are the styles',
    body: 'No stylesheet to maintain — colour, spacing, radii, type and motion resolve from one token source shared with the web. Re-theme once, both platforms follow.',
  },
  {
    icon: 'zap',
    title: 'Runs for real',
    body: 'Every variant has a live Expo Snack — edit inline or scan the QR to run it on your phone. Reanimated springs and Skia glass, not screenshots.',
  },
]

const count = components.length
const variantCount = components.reduce((n, c) => n + c.variants.length, 0)
</script>

<template>
  <div class="nl">
    <header class="nl__hero">
      <p class="nl__eyebrow">React Native · Expo · Skia</p>
      <h1 class="nl__title">FusionUI, on <b>mobile</b></h1>
      <p class="nl__sub">
        One design language, two runtimes. <code>@rukkiecodes/native</code> brings the FusionUI
        components, the token-driven styles, and the signature liquid glass to Expo + React Native —
        sharing the web's contracts, not its code.
      </p>

      <div class="nl__cta">
        <RouterLink v-slot="{ href, navigate }" to="/components" custom>
          <f-btn
            color="primary"
            size="large"
            append-icon="arrow-right"
            :href="href"
            @click="navigate"
          >
            Explore the components
          </f-btn>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate }" to="/install" custom>
          <f-btn variant="text" size="large" prepend-icon="download" :href="href" @click="navigate">
            Install
          </f-btn>
        </RouterLink>
      </div>

      <p class="nl__stats">
        <b>{{ count }}</b> components · <b>{{ variantCount }}</b> live Snacks
      </p>
    </header>

    <div class="nl__grid">
      <article v-for="f in features" :key="f.title" class="nl__card">
        <span class="nl__card-icon"><f-icon :icon="f.icon" /></span>
        <h3>{{ f.title }}</h3>
        <p>{{ f.body }}</p>
      </article>
    </div>

    <div class="nl__band">
      <div class="nl__band-copy">
        <h2>Ready to build on the phone?</h2>
        <p>
          Every component has its own page and a live Snack per variant — edit inline, or scan the
          QR to run it on your device.
        </p>
      </div>
      <RouterLink v-slot="{ href, navigate }" to="/components" custom>
        <f-btn
          color="primary"
          size="large"
          append-icon="arrow-right"
          :href="href"
          @click="navigate"
        >
          Browse all components
        </f-btn>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.nl {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}
.nl__hero {
  padding: 24px 0 8px;
}
.nl__eyebrow {
  margin: 0;
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  color: rgb(var(--fui-theme-primary));
}
.nl__title {
  margin: 12px 0 0;
  font-size: clamp(2.2rem, 6vw, 3.6rem);
  font-weight: 780;
  letter-spacing: -0.035em;
  line-height: 1.05;
}
.nl__title b {
  background: linear-gradient(
    100deg,
    rgb(var(--fui-theme-primary)),
    rgb(var(--fui-theme-secondary))
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: inherit;
}
.nl__sub {
  margin: 18px 0 0;
  max-width: 62ch;
  font-size: 1.08rem;
  line-height: 1.65;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.66));
}
.nl__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.nl__stats {
  margin: 18px 0 0;
  font-size: 0.9rem;
  color: rgba(var(--fui-theme-on-surface), 0.55);
}
.nl__stats b {
  color: rgb(var(--fui-theme-primary));
}
.nl__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin: 44px 0 0;
}
.nl__card {
  padding: 24px;
  border-radius: var(--fui-radius-lg, 18px);
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
}
.nl__card-icon {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.1);
}
.nl__card h3 {
  margin: 16px 0 8px;
  font-size: 1.08rem;
}
.nl__card p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.66));
}
.nl__band {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 44px 0 0;
  padding: 32px;
  border-radius: var(--fui-radius-xl, 24px);
  background: rgba(var(--fui-theme-primary), 0.06);
}
.nl__band-copy h2 {
  margin: 0 0 6px;
  font-size: 1.4rem;
  letter-spacing: -0.02em;
}
.nl__band-copy p {
  margin: 0;
  max-width: 52ch;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.66));
}
</style>
