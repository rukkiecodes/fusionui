<script setup lang="ts">
// Home of the mobile docs — the copy-in model. One command sets a project up with
// the minimal Text + Button; add anything else on demand.
import { components } from '@/registry'
import CommandBlock from '@/components/CommandBlock.vue'

const features = [
  {
    icon: 'download',
    title: 'Copy-in, you own it',
    body: 'add drops the component’s source straight into your project. No black-box package — edit, theme and extend it however you like.',
  },
  {
    icon: 'feather',
    title: 'Minimal by default',
    body: 'init gives you just Text and Button. Your bundle only ever carries the components you actually pulled in.',
  },
  {
    icon: 'zap',
    title: 'Motion built in',
    body: 'Real interaction, not static styles — Reanimated press springs, loading crossfades and gradient fills ship in the source you copy in.',
  },
  {
    icon: 'smartphone',
    title: 'Expo + React Native',
    body: 'Built for Expo. Each component lists the packages it needs, and add prints the one expo install line to run.',
  },
]

const count = components.length
</script>

<template>
  <div class="nl">
    <header class="nl__hero">
      <p class="nl__eyebrow">React Native · Expo · copy-in</p>
      <h1 class="nl__title">Beautiful RN components,<br /><b>one command away</b></h1>
      <p class="nl__sub">
        FusionUI on mobile is copy-in. Start a project with the bare minimum —
        <code>Text</code> and <code>Button</code> — and pull in anything else one command at a time.
        The source lands in your project, so you own it.
      </p>

      <div class="nl__cmd">
        <CommandBlock command="npx @rukkiecodes/native init" />
      </div>

      <div class="nl__cta">
        <RouterLink v-slot="{ href, navigate }" to="/components" custom>
          <f-btn
            color="primary"
            size="large"
            append-icon="arrow-right"
            :href="href"
            @click="navigate"
          >
            Browse the components
          </f-btn>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate }" to="/install" custom>
          <f-btn variant="text" size="large" prepend-icon="terminal" :href="href" @click="navigate">
            How it works
          </f-btn>
        </RouterLink>
      </div>

      <p class="nl__stats">
        <b>{{ count }}</b> components and counting
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
        <h2>Add your first component</h2>
        <p>
          <code>init</code> writes a tiny config and copies Text + Button in. From there,
          <code>add &lt;name&gt;</code> pulls in the rest.
        </p>
      </div>
      <RouterLink v-slot="{ href, navigate }" to="/install" custom>
        <f-btn
          color="primary"
          size="large"
          append-icon="arrow-right"
          :href="href"
          @click="navigate"
        >
          Get started
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
  color: rgb(var(--fui-theme-primary));
}
.nl__title {
  margin: 12px 0 0;
  font-size: clamp(2.1rem, 6vw, 3.4rem);
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
.nl__cmd {
  margin: 24px 0 0;
  max-width: 420px;
}
.nl__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
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
