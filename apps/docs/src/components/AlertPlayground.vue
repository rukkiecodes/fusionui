<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

const variants = ['default', 'solid', 'border', 'shadow', 'gradient', 'flat', 'relief']
const colors = ['primary', 'success', 'danger', 'warning', 'dark']

const variant = ref('default')
const copied = ref(false)
const show = ref(true)

const cfg = reactive({
  title: 'FusionUI Framework',
  text: 'A configurable alert — tweak the controls on the right.',
  color: 'primary',
  closable: false,
  icon: false,
})

const defaults = JSON.stringify(cfg)

// Re-show the alert whenever a setting changes (the close button hides it).
watch([variant, () => ({ ...cfg })], () => (show.value = true), { deep: true })

const code = computed(() => {
  const a: string[] = []
  if (variant.value !== 'default') a.push(`variant="${variant.value}"`)
  if (cfg.color !== 'primary') a.push(`color="${cfg.color}"`)
  if (cfg.closable) a.push('closable')
  if (cfg.icon) a.push('icon="bell"')
  const open = a.length ? `<f-alert ${a.join(' ')}>` : '<f-alert>'
  return [open, `  <template #title>${cfg.title}</template>`, `  ${cfg.text}`, `</f-alert>`].join(
    '\n'
  )
})

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  variant.value = 'default'
  Object.assign(cfg, JSON.parse(defaults))
  show.value = true
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
        <f-alert
          v-model="show"
          :variant="variant"
          :color="cfg.color"
          :closable="cfg.closable"
          :icon="cfg.icon ? 'bell' : undefined"
          style="max-width: 460px"
        >
          <template #title>{{ cfg.title }}</template>
          {{ cfg.text }}
        </f-alert>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Configuration</p>
        <f-input v-model="cfg.title" label="Title" label-placeholder />
        <f-input v-model="cfg.text" label="Text" label-placeholder />
        <f-select v-model="cfg.color" :items="colors" label="Color" />
        <div class="pg__checks">
          <f-checkbox v-model="cfg.closable" label="Closable" />
          <f-checkbox v-model="cfg.icon" label="Icon" />
        </div>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>
