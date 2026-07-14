<script setup lang="ts">
import { ref } from 'vue'
import { shades } from '@rukkiecodes/tokens'

// The swatches are read straight from @rukkiecodes/tokens, so this grid can never
// drift from what the library actually ships. Step 500 is the theme colour itself.
const ramps = Object.entries(shades) as [string, Record<string, string>][]

type Mode = 'var' | 'hex'
const mode = ref<Mode>('var')

const copied = ref<string | null>(null)

function valueFor(name: string, stop: string, hex: string): string {
  return mode.value === 'hex' ? hex : `rgb(var(--fui-${name}-${stop}))`
}

async function copy(name: string, stop: string, hex: string) {
  const value = valueFor(name, stop, hex)
  await navigator.clipboard.writeText(value)
  copied.value = `${name}-${stop}`
  setTimeout(() => (copied.value = null), 1200)
}

// A dark swatch needs light text on it. Same luminance rule the tokens use.
function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) <= 0.18
}
</script>

<template>
  <div class="pal">
    <div class="pal__bar">
      <span class="pal__hint">Click a swatch to copy</span>
      <div class="pal__modes" role="group" aria-label="Copy format">
        <button
          class="pal__mode"
          :class="{ 'pal__mode--on': mode === 'var' }"
          :aria-pressed="mode === 'var'"
          @click="mode = 'var'"
        >
          CSS var
        </button>
        <button
          class="pal__mode"
          :class="{ 'pal__mode--on': mode === 'hex' }"
          :aria-pressed="mode === 'hex'"
          @click="mode = 'hex'"
        >
          Hex
        </button>
      </div>
    </div>

    <div v-for="[name, ramp] in ramps" :key="name" class="pal__row">
      <div class="pal__name">{{ name }}</div>
      <div class="pal__swatches">
        <button
          v-for="(hex, stop) in ramp"
          :key="stop"
          class="pal__swatch"
          :class="{ 'pal__swatch--base': stop === '500', 'pal__swatch--dark': isDark(hex) }"
          :style="{ backgroundColor: hex }"
          :title="`${name}-${stop} · ${hex}`"
          :aria-label="`Copy ${name} ${stop}, ${hex}`"
          @click="copy(name, String(stop), hex)"
        >
          <span class="pal__stop">{{ stop }}</span>
          <span class="pal__hex">{{ copied === `${name}-${stop}` ? 'Copied' : hex }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pal {
  margin: 24px 0;
}

.pal__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.pal__hint {
  font-size: 0.82rem;
  color: rgba(var(--fui-theme-on-surface), 0.55);
}
.pal__modes {
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 9px;
  background: rgba(var(--fui-theme-on-surface), 0.07);
}
.pal__mode {
  padding: 5px 11px;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(var(--fui-theme-on-surface), 0.6);
  background: transparent;
  border: 0;
  border-radius: 7px;
  cursor: pointer;
}
.pal__mode--on {
  background: rgb(var(--fui-theme-surface));
  color: rgb(var(--fui-theme-on-surface));
  box-shadow: var(--fui-elevation-1);
}

.pal__row {
  margin-bottom: 18px;
}
.pal__name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(var(--fui-theme-on-surface), 0.5);
  margin-bottom: 6px;
}

.pal__swatches {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}
@media (max-width: 720px) {
  .pal__swatches {
    grid-template-columns: repeat(5, 1fr);
  }
}

.pal__swatch {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
  height: 78px;
  padding: 8px 7px;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  /* Dark-on-light by default; flipped for dark swatches below. */
  color: rgba(0, 0, 0, 0.72);
  transition: transform var(--fui-transition-duration) var(--fui-transition-timing);
}
.pal__swatch:hover {
  transform: translateY(-2px);
}
.pal__swatch:focus-visible {
  outline: 2px solid rgb(var(--fui-theme-primary));
  outline-offset: 2px;
}
.pal__swatch--dark {
  color: rgba(255, 255, 255, 0.9);
}
/* 500 is the theme colour itself — mark it so it is findable at a glance. */
.pal__swatch--base {
  box-shadow: inset 0 0 0 2px rgb(var(--fui-theme-on-surface));
}

.pal__stop {
  font-size: 0.74rem;
  font-weight: 700;
  opacity: 0.85;
}
.pal__hex {
  font-family: var(--fui-font-family-mono);
  font-size: 0.62rem;
  opacity: 0.75;
}

@media (prefers-reduced-motion: reduce) {
  .pal__swatch {
    transition: none;
  }
  .pal__swatch:hover {
    transform: none;
  }
}
</style>
