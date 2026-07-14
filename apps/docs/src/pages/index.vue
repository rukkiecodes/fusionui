<script setup lang="ts">
import { ref } from 'vue'
// The landing page dogfoods the library: every control below is a real FusionUI
// component, running the same code a consumer installs.
const logoUrl = new URL('../../public/logo.svg', import.meta.url).href

const copied = ref(false)
const install = 'npm create fusionui@latest'

async function copyInstall() {
  await navigator.clipboard.writeText(install)
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

// Numbers are real: 133 registered components, the shipped icon set, and the
// gzipped barrel measured by tools/check-bundle-size.mjs.
const stats = [
  { value: '133', label: 'components' },
  { value: '737', label: 'icons included' },
  { value: '~1 kB', label: 'gzipped per component' },
  { value: '481', label: 'tests, and an SSR gate' },
]

const pillars = [
  {
    icon: 'layers',
    title: 'One source of design truth',
    text: 'Colour, spacing, type, radii and motion are authored once as tokens and generated for CSS, TypeScript and React Native. Components never hard-code a value, so re-skinning a brand never means forking a component.',
    to: '/getting-started/design-tokens',
  },
  {
    icon: 'droplet',
    title: 'A signature visual layer',
    text: 'Real GPU work — liquid-glass refraction, metaball goo, a lazy-loaded WebGL2 shader runtime — used for depth and motion rather than decoration. Every effect has a static fallback and a reduced-motion path, and the runtime never blocks interaction.',
    to: '/labs',
  },
  {
    icon: 'check-circle',
    title: 'Accessible by default',
    text: 'The WAI-ARIA patterns are implemented properly: combobox, tree, grid, radiogroup, roving tabindex, focus traps. Keyboard support and prefers-reduced-motion are a blocker for shipping a component, not a backlog item.',
    to: '/features/accessibility',
  },
  {
    icon: 'server',
    title: 'SSR-safe by construction',
    text: 'No component touches window or document at module load, and a test server-renders every registered component on every commit. Nuxt needs a ten-line plugin — not a module.',
    to: '/features/ssr',
  },
  {
    icon: 'smartphone',
    title: 'Cross-platform, honestly',
    text: 'Vue on the web, Expo and Skia on mobile. What is genuinely shared is the token values, the component API and the interaction semantics — not the same .vue files pretending to run on a phone.',
    to: '/getting-started/native',
  },
  {
    icon: 'terminal',
    title: 'A CLI that ships a real project',
    text: 'Pick a target — SPA, PWA, static site, Nuxt or Expo — then the presets you actually want. What comes out installs, builds and lints cleanly on the first run.',
    to: '/getting-started/installation',
  },
]

const snippet = `<f-btn color="primary" prepend-icon="rocket">
  Ship it
</f-btn>

<f-data-table
  :headers="headers"
  :items="items"
  show-select
  search="lana"
/>`
</script>

<template>
  <div class="landing">
    <!-- Hero ------------------------------------------------------------- -->
    <section class="hero">
      <f-glass class="hero__glass" :blur="18" :radius="28">
        <img :src="logoUrl" alt="" class="hero__logo" width="72" height="72" />

        <h1 class="hero__title">
          The Vue design system that
          <span class="hero__grad">doesn't look like a default</span>
        </h1>

        <p class="hero__sub">
          Vuetify's engineering stability with Vuesax's looks — 133 accessible, token-driven,
          SSR-safe components, plus a GPU visual layer that always degrades gracefully. One design
          language for Vue and React Native.
        </p>

        <div class="hero__cta">
          <!-- FBtn renders an anchor when given `href` (it has no `to` prop);
               RouterLink supplies one and keeps the navigation client-side. -->
          <RouterLink v-slot="{ href, navigate }" to="/getting-started/installation" custom>
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
      </f-glass>
    </section>

    <!-- Stats ------------------------------------------------------------ -->
    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat">
        <div class="stat__value">{{ s.value }}</div>
        <div class="stat__label">{{ s.label }}</div>
      </div>
    </section>

    <!-- Live showcase ----------------------------------------------------- -->
    <section class="section">
      <p class="eyebrow">Live, not a screenshot</p>
      <h2 class="section__title">Everything here is the real library</h2>

      <div class="showcase">
        <f-card class="showcase__card">
          <f-card-title>Buttons</f-card-title>
          <f-card-text>
            <div class="row">
              <f-btn color="primary">Primary</f-btn>
              <f-btn color="secondary" variant="gradient">Gradient</f-btn>
              <f-btn color="success" variant="tonal">Tonal</f-btn>
              <f-btn color="danger" variant="outlined">Outlined</f-btn>
              <f-btn color="warning" variant="relief">Relief</f-btn>
            </div>
          </f-card-text>
        </f-card>

        <f-card class="showcase__card">
          <f-card-title>Inputs &amp; selection</f-card-title>
          <f-card-text>
            <div class="stack">
              <f-input label="Email" placeholder="you@company.com" prepend-icon="mail" block />
              <div class="row">
                <f-switch :model-value="true" color="primary">Notify me</f-switch>
                <f-rating :model-value="4" hover aria-label="Rating" />
              </div>
              <div class="row">
                <f-chip color="primary">Design</f-chip>
                <f-chip color="success">Shipped</f-chip>
                <f-chip color="danger" variant="outlined">Blocked</f-chip>
              </div>
            </div>
          </f-card-text>
        </f-card>
      </div>
    </section>

    <!-- Pillars ------------------------------------------------------------ -->
    <section class="section">
      <p class="eyebrow">Why it's built this way</p>
      <h2 class="section__title">Opinionated where it counts</h2>

      <div class="pillars">
        <router-link v-for="p in pillars" :key="p.title" :to="p.to" class="pillar">
          <f-icon :icon="p.icon" color="primary" size="large" />
          <h3 class="pillar__title">{{ p.title }}</h3>
          <p class="pillar__text">{{ p.text }}</p>
          <span class="pillar__more">Read more <f-icon icon="arrow-right" size="x-small" /></span>
        </router-link>
      </div>
    </section>

    <!-- Code ---------------------------------------------------------------- -->
    <section class="section">
      <p class="eyebrow">Familiar on purpose</p>
      <h2 class="section__title">If you know Vuetify, you already know this</h2>
      <p class="section__lead">
        The component API deliberately mirrors what you already reach for — so the thing you have to
        learn is the design language, not the props.
      </p>
      <pre class="code"><code>{{ snippet }}</code></pre>
    </section>

    <!-- Close ---------------------------------------------------------------- -->
    <section class="close">
      <h2 class="close__title">Build something that doesn't look templated</h2>
      <div class="hero__cta">
        <RouterLink v-slot="{ href, navigate }" to="/getting-started/quick-start" custom>
          <f-btn color="primary" size="large" :href="href" @click="navigate">Quick start</f-btn>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate }" to="/components/button" custom>
          <f-btn variant="text" size="large" :href="href" @click="navigate">
            Browse components
          </f-btn>
        </RouterLink>
      </div>
      <p class="close__note">
        MIT licensed · pre-1.0, so minor versions may still break ·
        <a href="https://github.com/rukkiecodes/fusionui" target="_blank">rukkiecodes/fusionui</a>
      </p>
    </section>
  </div>
</template>

<style scoped>
.landing {
  --gutter: 24px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 var(--gutter) 96px;
}

/* ---- hero ---- */
.hero {
  padding: 56px 0 32px;
}
.hero__glass {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 32px;
}
.hero__logo {
  margin-bottom: 20px;
}
.hero__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  /* Wide enough that the gradient clause stays on its own line rather than
     splitting mid-phrase. */
  max-width: 22ch;
  text-wrap: balance;
}
.hero__grad {
  background: linear-gradient(
    100deg,
    rgb(var(--fui-theme-primary)),
    rgb(var(--fui-theme-secondary))
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero__sub {
  margin: 20px 0 0;
  max-width: 60ch;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}
.hero__install {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding: 10px 16px;
  font-family: var(--fui-font-family-mono);
  font-size: 0.88rem;
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

/* ---- stats ---- */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 24px 0 56px;
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

/* ---- sections ---- */
.section {
  padding: 56px 0;
}
.eyebrow {
  margin: 0 0 8px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgb(var(--fui-theme-primary));
}
.section__title {
  margin: 0 0 8px;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.02em;
}
.section__lead {
  margin: 0 0 24px;
  max-width: 62ch;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
  line-height: 1.65;
}

/* ---- showcase ---- */
.showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 24px;
}
/* FCard caps itself at 350px by design; the showcase wants it to fill the column. */
.showcase__card {
  width: 100%;
  max-width: none;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ---- pillars ---- */
.pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 28px;
}
.pillar {
  display: block;
  padding: 24px;
  border-radius: var(--fui-radius-lg);
  border: thin solid rgba(var(--fui-border-color), 0.12);
  background: rgb(var(--fui-theme-surface));
  color: inherit;
  text-decoration: none;
  transition: var(--fui-transition);
}
.pillar:hover {
  transform: translateY(-3px);
  box-shadow: var(--fui-elevation-6);
  border-color: rgba(var(--fui-theme-primary), 0.4);
}
.pillar__title {
  margin: 14px 0 8px;
  font-size: 1.05rem;
}
.pillar__text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
.pillar__more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(var(--fui-theme-primary));
}

/* ---- code ---- */
.code {
  margin: 0;
  padding: 24px;
  overflow-x: auto;
  border-radius: var(--fui-radius-lg);
  background: #1a1b26;
  color: #c0caf5;
  font-family: var(--fui-font-family-mono);
  font-size: 0.88rem;
  line-height: 1.7;
}

/* ---- close ---- */
.close {
  text-align: center;
  padding: 72px 24px;
  border-radius: var(--fui-radius-xl);
  background: rgba(var(--fui-theme-primary), 0.06);
}
.close__title {
  margin: 0 0 24px;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.02em;
}
.close__note {
  margin: 28px 0 0;
  font-size: 0.85rem;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
.close__note a {
  color: rgb(var(--fui-theme-primary));
}

@media (prefers-reduced-motion: reduce) {
  .pillar,
  .hero__install {
    transition: none;
  }
  .pillar:hover {
    transform: none;
  }
}
</style>
