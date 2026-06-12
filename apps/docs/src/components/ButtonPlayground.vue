<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const variants = [
  'elevated',
  'flat',
  'tonal',
  'outlined',
  'text',
  'gradient',
  'relief',
  'shadow',
  'floating',
  'line',
]
const colors = ['primary', 'success', 'danger', 'warning', 'dark']
const sizes = ['x-small', 'small', 'default', 'large', 'x-large']

const variant = ref('elevated')
const copied = ref(false)

const cfg = reactive({
  text: 'Button',
  color: 'primary',
  size: 'default',
  prependIcon: false,
  appendIcon: false,
  rounded: false,
  block: false,
  loading: false,
  disabled: false,
})

const defaults = JSON.stringify(cfg)

const code = computed(() => {
  const a: string[] = []
  if (variant.value !== 'elevated') a.push(`variant="${variant.value}"`)
  if (cfg.color !== 'primary') a.push(`color="${cfg.color}"`)
  if (cfg.size !== 'default') a.push(`size="${cfg.size}"`)
  if (cfg.prependIcon) a.push(`prepend-icon="star"`)
  if (cfg.appendIcon) a.push(`append-icon="arrow-right"`)
  if (cfg.rounded) a.push(`rounded="pill"`)
  if (cfg.block) a.push('block')
  if (cfg.loading) a.push('loading')
  if (cfg.disabled) a.push('disabled')
  if (!a.length) return `<vd-btn>${cfg.text}</vd-btn>`
  return `<vd-btn\n  ${a.join('\n  ')}\n>\n  ${cfg.text}\n</vd-btn>`
})

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  variant.value = 'elevated'
  Object.assign(cfg, JSON.parse(defaults))
}
</script>

<template>
  <div class="pg">
    <div class="pg__bar">
      <div class="pg__tabs">
        <button
          v-for="v in variants"
          :key="v"
          class="pg__tab"
          :class="{ 'pg__tab--active': variant === v }"
          @click="variant = v"
        >
          {{ v }}
        </button>
      </div>
      <div class="pg__bar-actions">
        <button class="pg__icon" title="Reset" @click="reset">
          <vd-icon icon="refresh-cw" size="small" />
        </button>
        <button class="pg__icon" title="Copy code" @click="copy">
          <vd-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>
    </div>

    <div class="pg__body">
      <div class="pg__preview">
        <vd-btn
          :variant="variant"
          :color="cfg.color"
          :size="cfg.size"
          :prepend-icon="cfg.prependIcon ? 'star' : undefined"
          :append-icon="cfg.appendIcon ? 'arrow-right' : undefined"
          :rounded="cfg.rounded ? 'pill' : undefined"
          :block="cfg.block"
          :loading="cfg.loading"
          :disabled="cfg.disabled"
        >
          {{ cfg.text }}
        </vd-btn>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Configuration</p>
        <vd-input v-model="cfg.text" label="Text" label-placeholder />
        <vd-select v-model="cfg.color" :items="colors" label="Color" />
        <vd-select v-model="cfg.size" :items="sizes" label="Size" />
        <div class="pg__checks">
          <vd-checkbox v-model="cfg.prependIcon" label="Prepend icon" />
          <vd-checkbox v-model="cfg.appendIcon" label="Append icon" />
          <vd-checkbox v-model="cfg.rounded" label="Rounded (pill)" />
          <vd-checkbox v-model="cfg.block" label="Block" />
          <vd-checkbox v-model="cfg.loading" label="Loading" />
          <vd-checkbox v-model="cfg.disabled" label="Disabled" />
        </div>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>
