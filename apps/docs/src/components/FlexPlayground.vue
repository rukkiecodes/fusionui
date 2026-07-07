<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const directions = ['row', 'column', 'row-reverse', 'column-reverse']
const justifies = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly']
const aligns = ['stretch', 'start', 'center', 'end', 'baseline']

const copied = ref(false)

const cfg = reactive({
  direction: 'row',
  justify: 'start',
  align: 'stretch',
  wrap: false,
  gap: 2,
  items: 4,
})

const defaults = JSON.stringify(cfg)

// The exact class list applied to the preview — so the code below always
// matches what you see. Defaults (flex-row, align-stretch, ga-0) are omitted.
const classList = computed(() => {
  const c = ['d-flex']
  if (cfg.direction !== 'row') c.push(`flex-${cfg.direction}`)
  c.push(`justify-${cfg.justify}`)
  if (cfg.align !== 'stretch') c.push(`align-${cfg.align}`)
  if (cfg.wrap) c.push('flex-wrap')
  if (cfg.gap > 0) c.push(`ga-${cfg.gap}`)
  return c
})

const code = computed(
  () =>
    `<div class="${classList.value.join(' ')}">\n` +
    Array.from({ length: cfg.items }, (_, i) => `  <div>${i + 1}</div>`).join('\n') +
    `\n</div>`
)

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  Object.assign(cfg, JSON.parse(defaults))
}
</script>

<template>
  <div class="pg">
    <div class="pg__bar">
      <div class="pg__tabs">
        <button
          v-for="d in directions"
          :key="d"
          class="pg__tab"
          :class="{ 'pg__tab--active': cfg.direction === d }"
          @click="cfg.direction = d"
        >
          {{ d }}
        </button>
      </div>
      <div class="pg__bar-actions">
        <button class="pg__icon" title="Reset" @click="reset">
          <f-icon icon="refresh-cw" size="small" />
        </button>
        <button class="pg__icon" title="Copy code" @click="copy">
          <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>
    </div>

    <div class="pg__body">
      <div class="pg__preview">
        <div class="util-demo" style="width: 100%">
          <div
            class="util-demo__box"
            :class="classList"
            style="min-height: 150px; align-content: center"
          >
            <div v-for="n in cfg.items" :key="n" class="util-demo__item">{{ n }}</div>
          </div>
        </div>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Container</p>
        <f-select v-model="cfg.justify" :items="justifies" label="justify" />
        <f-select v-model="cfg.align" :items="aligns" label="align" />
        <div class="pg__checks">
          <f-checkbox v-model="cfg.wrap" label="flex-wrap" />
        </div>
        <p class="pg__config-title" style="margin-top: 16px">Gap — ga-{{ cfg.gap }}</p>
        <f-slider v-model="cfg.gap" :min="0" :max="7" :step="1" color="primary" />
        <p class="pg__config-title" style="margin-top: 8px">Items — {{ cfg.items }}</p>
        <f-slider v-model="cfg.items" :min="1" :max="8" :step="1" color="primary" />
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>
