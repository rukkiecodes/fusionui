<script setup lang="ts">
// The component index — every @rukkiecodes/native component, grouped by category.
import { componentsByCategory } from '@/manifest'

const groups = componentsByCategory()
</script>

<template>
  <div class="idx">
    <header class="idx__head">
      <h1>Components</h1>
      <p>
        Every component mirrors its web sibling's contract and runs for real in a live Expo Snack —
        one per variant. Pick a component to see its variants, props and Snacks.
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
          <div class="idx__card-top">
            <strong>{{ c.title }}</strong>
            <span class="idx__count">{{ c.variants.length }}</span>
          </div>
          <code class="idx__name">{{ c.component }}</code>
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
  max-width: 62ch;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity, 0.7));
  line-height: 1.6;
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.idx__card {
  display: block;
  padding: 16px;
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
.idx__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.idx__card-top strong {
  font-size: 1rem;
}
.idx__count {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
  color: rgb(var(--fui-theme-primary));
  background: rgba(var(--fui-theme-primary), 0.12);
}
.idx__name {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.8rem;
  color: rgba(var(--fui-theme-on-surface), 0.55);
}
</style>
