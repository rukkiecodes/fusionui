<script setup lang="ts">
// The home page for FusionUI on mobile. A showcase of the component + style story,
// with the primary CTA into the full Expo documentation (/native).

const features = [
  {
    icon: 'smartphone',
    title: 'Component parity',
    body: 'The same names, props, variants and states as the web — FButton, FCard, FInput, FSwitch, FAlert and more. A component feels identical on both platforms.',
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
    body: 'Every component has a live Expo Snack — edit inline or scan the QR to run it on your phone. Reanimated springs and Skia glass, not screenshots.',
  },
]
</script>

<template>
  <div class="nl">
    <!-- hero -->
    <header class="nl__hero">
      <p class="nl__eyebrow">React Native · Expo · Skia</p>
      <h1 class="nl__title">FusionUI, on <b>mobile</b></h1>
      <p class="nl__sub">
        One design language, two runtimes. <code>@rukkiecodes/native</code> brings the FusionUI
        components, the token-driven styles, and the signature liquid glass to Expo + React Native —
        sharing the web's contracts, not its code.
      </p>

      <div class="nl__cta">
        <RouterLink v-slot="{ href, navigate }" to="/native" custom>
          <f-btn
            color="primary"
            size="large"
            append-icon="arrow-right"
            :href="href"
            @click="navigate"
          >
            Explore the mobile components &amp; styles
          </f-btn>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate }" to="/native" custom>
          <f-btn variant="text" size="large" prepend-icon="download" :href="href" @click="navigate">
            Install
          </f-btn>
        </RouterLink>
      </div>
    </header>

    <!-- feature grid -->
    <div class="nl__grid">
      <article v-for="f in features" :key="f.title" class="nl__card">
        <span class="nl__card-icon"><f-icon :icon="f.icon" /></span>
        <h3>{{ f.title }}</h3>
        <p>{{ f.body }}</p>
      </article>
    </div>

    <!-- closing CTA band -->
    <div class="nl__band">
      <div class="nl__band-copy">
        <h2>Ready to build on the phone?</h2>
        <p>
          The full component reference, live Snacks, install and the parity table live in the Expo
          documentation.
        </p>
      </div>
      <RouterLink v-slot="{ href, navigate }" to="/native" custom>
        <f-btn
          color="primary"
          size="large"
          append-icon="arrow-up-right"
          :href="href"
          @click="navigate"
        >
          Open the Expo docs
        </f-btn>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.nl {
  margin: 8px 0 8px;
}
.nl__hero {
  padding: 8px 0 8px;
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
  font-size: clamp(2.2rem, 5vw, 3.4rem);
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
  max-width: 60ch;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.66));
}
.nl__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.nl__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin: 40px 0 0;
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
