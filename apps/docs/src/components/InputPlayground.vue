<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const variants = ['default', 'underlined', 'shadow']
const colors = ['primary', 'success', 'danger', 'warning', 'dark']

const variant = ref('default')
const copied = ref(false)

const model = ref('')
const cfg = reactive({
  label: 'Label',
  placeholder: 'Type here…',
  color: 'primary',
  labelPlaceholder: true,
  prependIcon: false,
  clearable: false,
  loading: false,
  block: false,
  disabled: false,
})

const defaults = JSON.stringify(cfg)

const code = computed(() => {
  const a: string[] = ['v-model="value"']
  if (cfg.label) a.push(`label="${cfg.label}"`)
  if (cfg.labelPlaceholder) a.push('label-placeholder')
  if (!cfg.labelPlaceholder && cfg.placeholder) a.push(`placeholder="${cfg.placeholder}"`)
  if (variant.value !== 'default') a.push(`variant="${variant.value}"`)
  if (cfg.color !== 'primary') a.push(`color="${cfg.color}"`)
  if (cfg.prependIcon) a.push(`prepend-icon="search"`)
  if (cfg.clearable) a.push('clearable')
  if (cfg.loading) a.push('loading')
  if (cfg.block) a.push('block')
  if (cfg.disabled) a.push('disabled')
  return `<f-input\n  ${a.join('\n  ')}\n/>`
})

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  variant.value = 'default'
  model.value = ''
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
          <f-icon icon="refresh-cw" size="small" />
        </button>
        <button class="pg__icon" title="Copy code" @click="copy">
          <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
        </button>
      </div>
    </div>

    <div class="pg__body">
      <div class="pg__preview">
        <f-input
          v-model="model"
          :label="cfg.label"
          :label-placeholder="cfg.labelPlaceholder"
          :placeholder="cfg.labelPlaceholder ? undefined : cfg.placeholder"
          :variant="variant"
          :color="cfg.color"
          :prepend-icon="cfg.prependIcon ? 'search' : undefined"
          :clearable="cfg.clearable"
          :loading="cfg.loading"
          :block="cfg.block"
          :disabled="cfg.disabled"
          style="min-width: 280px"
        />
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Configuration</p>
        <f-input v-model="cfg.label" label="Label" label-placeholder />
        <f-select v-model="cfg.color" :items="colors" label="Color" />
        <div class="pg__checks">
          <f-checkbox v-model="cfg.labelPlaceholder" label="Floating label" />
          <f-checkbox v-model="cfg.prependIcon" label="Prepend icon" />
          <f-checkbox v-model="cfg.clearable" label="Clearable" />
          <f-checkbox v-model="cfg.loading" label="Loading" />
          <f-checkbox v-model="cfg.block" label="Block" />
          <f-checkbox v-model="cfg.disabled" label="Disabled" />
        </div>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>
