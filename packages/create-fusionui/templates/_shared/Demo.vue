<script setup{{scriptLang}}>
import { ref } from 'vue'
import { useNotify, useTheme } from '@rukkiecodes/vue'

const { notify } = useNotify()
const theme = useTheme()
const count = ref(0)
const name = ref('')
const subscribed = ref(true)
</script>

<template>
  <f-navbar fixed flat class="nav">
    <template #left>
      <span class="nav__brand">
        <f-icon icon="feather" color="primary" />
        <strong>FusionUI</strong>
      </span>
    </template>
    <template #right>
      <f-btn
        variant="text"
        icon="github"
        href="https://github.com/rukkiecodes/fusionui"
        target="_blank"
        aria-label="GitHub"
      />
      <f-btn
        variant="text"
        :icon="theme.isDark.value ? 'sun' : 'moon'"
        aria-label="Toggle theme"
        @click="theme.toggle()"
      />
    </template>
  </f-navbar>

  <main class="page">
    <!-- Hero -->
    <section class="hero">
      <span class="hero__badge">
        <f-icon icon="zap" size="small" />
        Vue 3 · token-driven
      </span>
      <h1 class="hero__title">
        Build beautiful UIs with
        <span class="grad">FusionUI</span>
      </h1>
      <p class="hero__sub">
        A soft, modern component library — accessible, token-driven and SSR-safe. Edit
        <code>src/App.vue</code> and save — hot reload does the rest.
      </p>
      <div class="hero__cta">
        <f-btn color="primary" size="large" prepend-icon="zap" @click="count++">
          Clicked {{ count }}×
        </f-btn>
        <f-btn
          variant="border"
          size="large"
          prepend-icon="bell"
          @click="notify.success({ title: 'It works!', text: 'FusionUI is wired up correctly.' })"
        >
          Send a notification
        </f-btn>
      </div>
    </section>

    <!-- Component showcase -->
    <section class="showcase">
      <article class="demo">
        <h3 class="demo__title">Buttons</h3>
        <div class="row">
          <f-btn color="primary">Primary</f-btn>
          <f-btn color="success" variant="tonal">Tonal</f-btn>
          <f-btn color="danger" variant="border">Border</f-btn>
        </div>
        <div class="row">
          <f-chip color="primary">primary</f-chip>
          <f-chip color="success" variant="outlined">success</f-chip>
          <f-chip color="warning" prepend-icon="$warning">warning</f-chip>
        </div>
      </article>

      <article class="demo">
        <h3 class="demo__title">Inputs</h3>
        <f-input v-model="name" block placeholder="Your name" prepend-icon="user" />
        <div class="row row--between">
          <f-switch v-model="subscribed" color="primary">Email updates</f-switch>
          <f-badge v-if="count" :content="count">
            <f-icon icon="bell" />
          </f-badge>
        </div>
      </article>

      <article class="demo">
        <h3 class="demo__title">Get started</h3>
        <p class="demo__text">
          133 components, design tokens, 737 icons, and notification / dialog / loading services.
        </p>
        <div class="row">
          <f-btn
            variant="tonal"
            color="primary"
            append-icon="arrow-right"
            href="https://rukkiecodes.github.io/fusionui/"
            target="_blank"
          >
            Browse the docs
          </f-btn>
        </div>
      </article>
    </section>

    <footer class="foot">
      Made with <f-icon icon="heart" color="danger" size="small" /> using FusionUI
    </footer>
  </main>
</template>

<style>
:root {
  color-scheme: light dark;
}
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.011em;
  color: rgba(var(--fui-theme-on-background), 0.9);
  background-color: rgb(var(--fui-theme-background));
  background-image: radial-gradient(
    900px 460px at 50% -8%,
    rgba(var(--fui-theme-primary), 0.14),
    transparent 60%
  );
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 1.12rem;
  letter-spacing: -0.02em;
}

.page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 116px 24px 64px;
}

/* ---------------- hero ---------------- */
.hero {
  text-align: center;
  padding: 24px 0 8px;
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(var(--fui-theme-primary), 0.1);
  color: rgb(var(--fui-theme-primary));
  font-size: 0.8rem;
  font-weight: 600;
}
.hero__title {
  margin: 20px auto 14px;
  max-width: 14ch;
  font-size: clamp(2.4rem, 6vw, 3.7rem);
  font-weight: 750;
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.grad {
  background: linear-gradient(110deg, #195bff, #7d33ff 52%, #ff4d6d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero__sub {
  margin: 0 auto;
  max-width: 540px;
  font-size: 1.06rem;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), 0.6);
}
.hero__sub code {
  font-family: 'SF Mono', ui-monospace, Menlo, Consolas, monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(var(--fui-theme-on-surface), 0.08);
}
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 28px;
}

/* ---------------- showcase ---------------- */
.showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  margin-top: 56px;
}
.demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
  box-shadow: 0 5px 30px -18px rgba(0, 0, 0, 0.3);
}
.demo__title {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--fui-theme-on-surface), 0.45);
}
.demo__text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: rgba(var(--fui-theme-on-surface), 0.6);
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.row--between {
  justify-content: space-between;
}

/* ---------------- footer ---------------- */
.foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 56px;
  font-size: 0.85rem;
  color: rgba(var(--fui-theme-on-surface), 0.5);
}

@media (max-width: 560px) {
  .page {
    padding-top: 96px;
  }
}
</style>
