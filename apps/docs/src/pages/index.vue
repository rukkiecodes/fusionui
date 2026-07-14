<script setup lang="ts">
import { ref } from 'vue'
import HeroFloat from '../components/landing/HeroFloat.vue'
import FeatureSection from '../components/landing/FeatureSection.vue'
import UsesStrip from '../components/landing/UsesStrip.vue'

// The shape of this page follows the Vuesax landing (extras/vuesax-next): a
// full-height hero with the copy on the left and real components floating on the
// right, then alternating art/copy bands, a technology strip, and a close. The
// artwork is FusionUI's own — see LandingArt.vue for why none of theirs is used.

const logoUrl = new URL('../../public/logo.svg', import.meta.url).href

const copied = ref(false)
const install = 'npm create fusionui@latest'
async function copyInstall() {
  await navigator.clipboard.writeText(install)
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

// Real numbers: 133 registered components, the shipped icon set, and the suite
// that guards them.
const stats = [
  { value: '133', label: 'components' },
  { value: '737', label: 'icons included' },
  { value: '481', label: 'tests + an SSR gate' },
  { value: 'MIT', label: 'licensed' },
]
</script>

<template>
  <div class="landing">
    <!-- ================= HERO ================= -->
    <header class="init">
      <!-- The decorative dot field and glow that sit behind the hero on the original. -->
      <div class="points" aria-hidden="true">
        <span v-for="n in 16" :key="n" />
      </div>
      <div class="glow" aria-hidden="true" />

      <div class="hero">
        <img :src="logoUrl" alt="" class="hero__logo" width="56" height="56" />

        <!-- No hard <br>: the column is too narrow to hold a fixed first line at the
             top of the clamp, and a forced break just produced a ragged orphan.
             text-wrap: balance evens the lines out at every width instead. -->
        <h1 class="hero__title">
          Build <b>beautiful</b> Vue apps without looking like everyone else
        </h1>

        <p class="hero__sub">
          133 components with a soft, modern look — accessible, token-driven and SSR-safe, with a
          GPU visual layer that always degrades gracefully. One design language for Vue and React
          Native.
        </p>

        <div class="hero__cta">
          <!-- FBtn renders an anchor when given `href`; RouterLink supplies one and
               keeps the navigation client-side. -->
          <RouterLink v-slot="{ href, navigate }" to="/getting-started/quick-start" custom>
            <f-btn color="primary" size="large" :href="href" @click="navigate">Get started</f-btn>
          </RouterLink>

          <f-btn
            variant="outlined"
            size="large"
            prepend-icon="github"
            href="https://github.com/rukkiecodes/fusionui"
            target="_blank"
          >
            GitHub
          </f-btn>
        </div>

        <button class="hero__install" :aria-label="`Copy: ${install}`" @click="copyInstall">
          <code>{{ install }}</code>
          <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>

      <HeroFloat />
    </header>

    <div class="wrap">
      <!-- ================= STATS ================= -->
      <section class="stats">
        <div v-for="s in stats" :key="s.label" class="stat">
          <div class="stat__value">{{ s.value }}</div>
          <div class="stat__label">{{ s.label }}</div>
        </div>
      </section>

      <!-- ================= FEATURE BANDS ================= -->
      <FeatureSection
        art="tokens"
        eyebrow="One source of truth"
        title="Design *tokens*, not hard-coded values"
        body="Colour, spacing, type, radii and motion are authored once and generated for CSS, TypeScript and React Native. No component hard-codes a value, so re-skinning a brand never means forking a component — and the web and the phone can never drift apart."
        to="/getting-started/design-tokens"
        cta="Explore the tokens"
      />

      <FeatureSection
        flip
        art="glass"
        eyebrow="The signature layer"
        title="Real *GPU work*, that always degrades"
        body="Liquid-glass refraction and metaball goo — used for depth and motion, not decoration. Every effect paints a static fallback first, honours prefers-reduced-motion, and pauses the moment it scrolls off screen. Nothing here is required for a component to function."
        to="/labs/"
        cta="See the Labs"
      />

      <FeatureSection
        art="a11y"
        eyebrow="Not a backlog item"
        title="*Accessible* before it ships"
        body="The WAI-ARIA patterns are implemented properly — combobox, tree, grid, radiogroup, roving tabindex, focus traps. A component is not done until it is keyboard-operable, screen-reader correct and reduced-motion safe. That is a gate, not an aspiration."
        to="/features/accessibility"
        cta="How it's enforced"
      />

      <FeatureSection
        flip
        art="platforms"
        eyebrow="Cross-platform, honestly"
        title="The same language on *web and mobile*"
        body="Vue on the web, Expo and Skia on mobile. What is genuinely shared is the token values, the component API and the interaction semantics — not the same .vue files pretending to run on a phone. We would rather tell you exactly what carries across."
        to="/getting-started/native"
        cta="The mobile story"
      />

      <UsesStrip />

      <!-- ================= CLOSE ================= -->
      <section class="close">
        <h2 class="close__title">Start with a project that already works</h2>
        <p class="close__sub">
          Pick a target — SPA, PWA, static site, Nuxt or Expo — then the presets you actually want.
          What comes out installs, builds and lints cleanly on the first run.
        </p>
        <div class="hero__cta close__cta">
          <RouterLink v-slot="{ href, navigate }" to="/getting-started/installation" custom>
            <f-btn color="primary" size="large" :href="href" @click="navigate">
              Scaffold a project
            </f-btn>
          </RouterLink>
          <RouterLink v-slot="{ href, navigate }" to="/components/button" custom>
            <f-btn variant="text" size="large" :href="href" @click="navigate">
              Browse 133 components
            </f-btn>
          </RouterLink>
        </div>
        <p class="close__note">
          MIT licensed · pre-1.0, so minor versions may still break ·
          <a href="https://github.com/rukkiecodes/fusionui" target="_blank">rukkiecodes/fusionui</a>
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.landing {
  overflow-x: clip;
}
.wrap {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

/* ================= hero ================= */
.init {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 72px;
  min-height: 88vh;
}

.hero {
  flex: 1 1 520px;
  max-width: 560px;
  z-index: 2;
}
.hero__logo {
  margin-bottom: 20px;
}
.hero__title {
  margin: 0;
  font-size: clamp(2.1rem, 4vw, 3.15rem);
  font-weight: 750;
  line-height: 1.1;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.hero__title b {
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
.hero__sub {
  margin: 20px 0 0;
  max-width: 52ch;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}
.hero__install {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 10px 16px;
  font-family: var(--fui-font-family-mono);
  font-size: 0.86rem;
  color: inherit;
  background: rgba(var(--fui-theme-on-surface), 0.05);
  border: thin solid rgba(var(--fui-border-color), 0.14);
  border-radius: var(--fui-radius-pill);
  cursor: pointer;
  transition: var(--fui-transition);
}
.hero__install:hover {
  background: rgba(var(--fui-theme-on-surface), 0.09);
}

/* The dot grid and the glow behind the hero. */
.points {
  position: absolute;
  top: 92px;
  left: 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  z-index: 0;
}
.points span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(var(--fui-theme-primary), 0.35);
}
.glow {
  position: absolute;
  top: -12%;
  right: 6%;
  width: 720px;
  height: 720px;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    circle,
    rgba(var(--fui-theme-primary), 0.13),
    rgba(var(--fui-theme-secondary), 0.06) 45%,
    transparent 68%
  );
}

/* ================= stats ================= */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 8px 0 24px;
}
.stat {
  text-align: center;
}
.stat__value {
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--fui-theme-primary));
}
.stat__label {
  margin-top: 2px;
  font-size: 0.85rem;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}

/* ================= close ================= */
.close {
  text-align: center;
  padding: 72px 24px;
  margin-top: 40px;
  border-radius: var(--fui-radius-xl);
  background: rgba(var(--fui-theme-primary), 0.06);
}
.close__title {
  margin: 0 0 12px;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.02em;
}
.close__sub {
  margin: 0 auto;
  max-width: 56ch;
  line-height: 1.65;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
.close__cta {
  justify-content: center;
}
.close__note {
  margin: 28px 0 0;
  font-size: 0.85rem;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
.close__note a {
  color: rgb(var(--fui-theme-primary));
}

/* ================= responsive ================= */
@media (max-width: 960px) {
  .init {
    flex-direction: column;
    text-align: center;
    min-height: auto;
    padding-bottom: 24px;
  }
  .hero {
    max-width: 640px;
  }
  .hero__sub {
    margin-inline: auto;
  }
  .hero__cta {
    justify-content: center;
  }
  .points {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__install {
    transition: none;
  }
}
</style>
