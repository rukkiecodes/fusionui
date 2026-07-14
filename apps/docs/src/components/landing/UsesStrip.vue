<script setup lang="ts">
// The Vuesax landing has a drag-scrollable band of the technologies it is built
// with. Same idea, honest content: this is what FusionUI is actually made of, and
// the icons come from the icon set the library already ships — nothing borrowed.
const stack = [
  { icon: 'code', name: 'Vue 3', note: 'script setup, no Options API' },
  { icon: 'type', name: 'TypeScript', note: 'typed end to end' },
  { icon: 'zap', name: 'Vite', note: 'library + docs build' },
  { icon: 'droplet', name: 'Sass', note: 'co-located component styles' },
  { icon: 'layers', name: 'Design tokens', note: 'one source, four outputs' },
  { icon: 'smartphone', name: 'Expo + Skia', note: 'the mobile implementation' },
  { icon: 'check-circle', name: 'Vitest', note: '481 tests, and an SSR gate' },
  { icon: 'eye', name: 'Playwright + axe', note: 'visual + a11y checks' },
  { icon: 'package', name: 'pnpm + changesets', note: 'the monorepo and its releases' },
]
</script>

<template>
  <section class="uses">
    <h2 class="uses__title">
      These are the <b>libraries</b>, <b>languages</b> and <b>tools</b><br />
      FusionUI is actually built with
    </h2>

    <!-- Overflow-scroll rather than a drag handler: it keeps the keyboard and a
         trackpad working, which a mousedown-drag implementation quietly breaks. -->
    <ul class="uses__list" tabindex="0" aria-label="The FusionUI technology stack">
      <li v-for="item in stack" :key="item.name" class="use">
        <span class="use__icon"><f-icon :icon="item.icon" size="large" /></span>
        <strong class="use__name">{{ item.name }}</strong>
        <span class="use__note">{{ item.note }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.uses {
  padding: 80px 0;
}
.uses__title {
  margin: 0 0 40px;
  text-align: center;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  line-height: 1.35;
  letter-spacing: -0.02em;
  font-weight: 600;
}
.uses__title b {
  background: linear-gradient(
    100deg,
    rgb(var(--fui-theme-primary)),
    rgb(var(--fui-theme-secondary))
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.uses__list {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 6px 4px 20px;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x proximity;
}
.uses__list:focus-visible {
  outline: 2px solid rgb(var(--fui-theme-primary));
  outline-offset: 4px;
  border-radius: 16px;
}

.use {
  flex: 0 0 auto;
  width: 200px;
  padding: 22px;
  border-radius: 18px;
  scroll-snap-align: start;
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
  transition: var(--fui-transition);
}
.use:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--fui-theme-primary), 0.42);
  box-shadow: 0 16px 34px -14px rgba(var(--fui-theme-primary), 0.3);
}

.use__icon {
  display: inline-flex;
  padding: 10px;
  border-radius: 14px;
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.1);
}
.use__name {
  display: block;
  margin-top: 14px;
  font-size: 1rem;
}
.use__note {
  display: block;
  margin-top: 4px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}

@media (prefers-reduced-motion: reduce) {
  .use {
    transition: none;
  }
  .use:hover {
    transform: none;
  }
}
</style>
