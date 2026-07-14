<script setup lang="ts">
// The nine palette keys the default themes define. `bg-*` colors the tile and
// picks the readable foreground (`on-*`) for you.
const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'dark', 'light']
const surfaces = ['background', 'surface']
const alphas = [1, 0.5, 0.24, 0.12, 0.08]
</script>

<template>
  <div class="palette">
    <div class="grid">
      <div v-for="c in colors" :key="c" class="swatch" :class="`bg-${c}`">
        <span class="swatch__name">{{ c }}</span>
        <code class="swatch__var">--fui-theme-{{ c }}</code>
      </div>
      <div v-for="s in surfaces" :key="s" class="swatch swatch--outlined" :class="`bg-${s}`">
        <span class="swatch__name">{{ s }}</span>
        <code class="swatch__var">--fui-theme-{{ s }}</code>
      </div>
    </div>

    <p class="caption">One triplet, five alphas — <code>rgba(var(--fui-theme-primary), α)</code></p>

    <div class="ramp">
      <div v-for="a in alphas" :key="a" class="step">
        <span
          class="step__chip"
          :style="{ backgroundColor: `rgba(var(--fui-theme-primary), ${a})` }"
        />
        <span class="step__label">{{ a }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.palette {
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.swatch {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  min-height: 84px;
  border-radius: var(--fui-radius-md);
  box-shadow: var(--fui-shadow-rest);
}

/* `background` and `surface` are near-invisible against the page — outline them
   with the theme's own hairline. Both variables are triplets. */
.swatch--outlined {
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity));
  box-shadow: none;
}

.swatch__name {
  font-weight: 600;
  font-size: 13px;
  text-transform: capitalize;
}

.swatch__var {
  font-family: var(--fui-font-family-mono);
  font-size: 11px;
  opacity: 0.75;
}

.caption {
  margin: 24px 0 8px;
  font-size: 13px;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}

.caption code {
  font-family: var(--fui-font-family-mono);
  font-size: 12px;
}

.ramp {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step__chip {
  display: block;
  width: 72px;
  height: 48px;
  border-radius: var(--fui-radius-sm);
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity));
}

.step__label {
  font-family: var(--fui-font-family-mono);
  font-size: 11px;
  color: rgba(var(--fui-theme-on-surface), var(--fui-medium-emphasis-opacity));
}
</style>
