<script setup lang="ts">
import { computed } from 'vue'
import { radius, space, shadows, font, motion, opacity, themes } from '@fusionui/tokens'

const props = withDefaults(
  defineProps<{ group?: 'color' | 'radius' | 'space' | 'shadow' | 'type' | 'motion' }>(),
  {
    group: 'color',
  }
)

// Show the light theme's named colors (the dark values track them 1:1 in name).
const colorEntries = computed(() =>
  Object.entries(themes.light.colors)
    .filter(([k]) => !k.startsWith('on-'))
    .map(([name, light]) => ({ name, light, dark: themes.dark.colors[name] }))
)
const radiusEntries = computed(() => Object.entries(radius))
const spaceEntries = computed(() => Object.entries(space).filter(([k]) => k !== 'spacer'))
// A representative slice of the 0–24 elevation ramp.
const shadowEntries = computed(() =>
  ['0', '1', '3', '6', '12', '18', '24'].map(k => [k, shadows[k]] as const)
)
const weightEntries = computed(() => Object.entries(font.weight))
const durationEntries = computed(() => Object.entries(motion.duration))
</script>

<template>
  <div class="tok">
    <!-- Colors -->
    <div v-if="props.group === 'color'" class="tok__grid">
      <div v-for="c in colorEntries" :key="c.name" class="tok__swatch">
        <div class="tok__chip" :style="{ background: `rgb(var(--fui-theme-${c.name}))` }" />
        <div class="tok__meta">
          <strong>{{ c.name }}</strong>
          <code>--fui-theme-{{ c.name }}</code>
          <span class="tok__pair"><i :style="{ background: c.light }" />{{ c.light }}</span>
          <span class="tok__pair"><i :style="{ background: c.dark }" />{{ c.dark }}</span>
        </div>
      </div>
    </div>

    <!-- Radii -->
    <div v-else-if="props.group === 'radius'" class="tok__grid">
      <div v-for="[name, value] in radiusEntries" :key="name" class="tok__swatch">
        <div class="tok__radius" :style="{ borderRadius: value }" />
        <div class="tok__meta">
          <strong>{{ name }}</strong>
          <code>{{ value }}</code>
        </div>
      </div>
    </div>

    <!-- Spacing -->
    <div v-else-if="props.group === 'space'" class="tok__rows">
      <div v-for="[name, value] in spaceEntries" :key="name" class="tok__row">
        <span class="tok__row-label">space-{{ name }}</span>
        <span class="tok__bar" :style="{ width: value }" />
        <code>{{ value }}</code>
      </div>
    </div>

    <!-- Shadows -->
    <div v-else-if="props.group === 'shadow'" class="tok__grid">
      <div v-for="[name, value] in shadowEntries" :key="name" class="tok__swatch">
        <div class="tok__elev" :style="{ boxShadow: value === 'none' ? '' : value }" />
        <div class="tok__meta">
          <strong>elevation-{{ name }}</strong>
          <code>{{ value }}</code>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div v-else-if="props.group === 'type'" class="tok__rows">
      <div class="tok__type" :style="{ fontFamily: font.family.base }">
        The quick brown fox — base family
      </div>
      <div class="tok__type tok__type--mono" :style="{ fontFamily: font.family.mono }">
        const x = 42 — mono family
      </div>
      <div v-for="[name, w] in weightEntries" :key="name" class="tok__row">
        <span class="tok__row-label">{{ name }}</span>
        <span :style="{ fontWeight: w }"
          >Weight {{ w }} — generous whitespace, refined tracking</span
        >
      </div>
    </div>

    <!-- Motion -->
    <div v-else-if="props.group === 'motion'" class="tok__rows">
      <div v-for="[name, value] in durationEntries" :key="name" class="tok__row">
        <span class="tok__row-label">{{ name }}</span>
        <code>{{ value }}</code>
      </div>
      <div class="tok__row">
        <span class="tok__row-label">easing</span><code>{{ motion.easing.base }}</code>
      </div>
      <div class="tok__row">
        <span class="tok__row-label">lift / sink</span
        ><code>{{ motion.lift }} / {{ motion.sink }}</code>
      </div>
      <div class="tok__row">
        <span class="tok__row-label">hover / focus / pressed opacity</span
        ><code>{{ opacity.hover }} / {{ opacity.focus }} / {{ opacity.pressed }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tok {
  margin: 16px 0 8px;
}
.tok__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.tok__swatch {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-lg);
  background: rgb(var(--fui-theme-surface));
}
.tok__chip {
  width: 44px;
  height: 44px;
  border-radius: var(--fui-radius-md);
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.tok__radius {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: rgb(var(--fui-theme-primary));
}
.tok__elev {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-surface));
  border: 1px solid rgba(var(--fui-border-color), 0.06);
}
.tok__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  min-width: 0;
}
.tok__meta code,
.tok__row code {
  font-family: var(--fui-font-family-mono);
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tok__pair {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.75;
}
.tok__pair i {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.tok__rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tok__row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.tok__row-label {
  width: 220px;
  flex-shrink: 0;
  font-weight: 500;
  font-size: 14px;
}
.tok__bar {
  height: 16px;
  background: rgb(var(--fui-theme-primary));
  border-radius: 4px;
}
.tok__type {
  font-size: 22px;
}
.tok__type--mono {
  font-size: 16px;
}
</style>
