<script setup lang="ts">
// The component index — everything in the copy-in registry, grouped by category.
import { componentsByCategory } from '@/registry'

const groups = componentsByCategory()
</script>

<template>
  <div class="idx">
    <header class="idx__head">
      <h1>Components</h1>
      <p>
        Every component is copy-in: pick one and run
        <code>npx @rukkiecodes/native add &lt;name&gt;</code>
        to drop its source into your project, where you own it. Start minimal — Text and Button —
        and add the rest as you need them.
      </p>
    </header>

    <section v-for="g in groups" :key="g.category" class="idx__group">
      <h2 class="idx__cat">{{ g.category }}</h2>
      <div class="idx__grid">
        <RouterLink
          v-for="c in g.items"
          :key="c.slug"
          :to="`/components/${c.slug}`"
          class="idx__card"
        >
          <strong>{{ c.title }}</strong>
          <p>{{ c.description }}</p>
          <code class="idx__add">add {{ c.slug }}</code>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.idx__head {
  margin-bottom: 28px;
}
.idx__head h1 {
  margin: 0 0 8px;
  font-size: clamp(1.9rem, 4vw, 2.4rem);
  letter-spacing: -0.03em;
}
.idx__head p {
  margin: 0;
  max-width: 64ch;
  line-height: 1.6;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.7));
}
.idx__cat {
  margin: 30px 0 12px;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--fui-theme-on-surface), 0.5);
}
.idx__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.idx__card {
  display: block;
  padding: 18px;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}
.idx__card:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--fui-theme-primary), 0.5);
}
.idx__card strong {
  font-size: 1.05rem;
}
.idx__card p {
  margin: 6px 0 12px;
  font-size: 0.88rem;
  line-height: 1.5;
  color: rgba(var(--fui-theme-on-surface), 0.6);
}
.idx__add {
  font-size: 0.78rem;
  padding: 3px 8px;
  border-radius: 7px;
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.1);
}
</style>
