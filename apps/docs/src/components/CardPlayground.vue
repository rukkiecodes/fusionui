<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const types = [
  { value: '1', label: 'Default' },
  { value: '2', label: 'Type 2' },
  { value: '3', label: 'Type 3' },
  { value: '4', label: 'Type 4' },
  { value: '5', label: 'Type 5' },
  { value: '6', label: 'Type 6' },
]
const images = ['foto5.png', 'foto1.png', 'foto2.jpg', 'foto6.png', 'foto13.png']

const type = ref('1')
const copied = ref(false)

const cfg = reactive({
  title: 'Trendy clothing',
  text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  image: 'foto5.png',
  interactions: true,
  parallax: 280,
})

const defaults = JSON.stringify(cfg)

const imgUrl = computed(() => `${import.meta.env.BASE_URL}cards/${cfg.image}`)

const code = computed(() => {
  const lines: string[] = []
  const attrs: string[] = []
  if (type.value !== '1') attrs.push(`type="${type.value}"`)
  if (type.value === '6' && cfg.parallax !== 280) attrs.push(`:parallax="${cfg.parallax}"`)
  lines.push(`<vd-card${attrs.length ? ' ' + attrs.join(' ') : ''}>`)
  if (cfg.title) lines.push(`  <template #title><h3>${cfg.title}</h3></template>`)
  lines.push(`  <template #img><img src="/cards/${cfg.image}" alt="" /></template>`)
  if (cfg.text) lines.push(`  <template #text><p>${cfg.text}</p></template>`)
  if (cfg.interactions) {
    lines.push(`  <template #interactions>`)
    lines.push(`    <vd-btn icon="heart" color="danger" />`)
    lines.push(`    <vd-btn color="primary" prepend-icon="message-circle">54</vd-btn>`)
    lines.push(`  </template>`)
  }
  lines.push(`</vd-card>`)
  return lines.join('\n')
})

async function copy() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
function reset() {
  type.value = '1'
  Object.assign(cfg, JSON.parse(defaults))
}
</script>

<template>
  <div class="pg">
    <div class="pg__bar">
      <div class="pg__tabs">
        <button
          v-for="t in types"
          :key="t.value"
          class="pg__tab"
          :class="{ 'pg__tab--active': type === t.value }"
          @click="type = t.value"
        >
          {{ t.label }}
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
        <vd-card :type="type" :parallax="cfg.parallax" style="max-width: 320px">
          <template v-if="cfg.title" #title
            ><h3>{{ cfg.title }}</h3></template
          >
          <template #img><img :src="imgUrl" alt="" /></template>
          <template v-if="cfg.text" #text
            ><p>{{ cfg.text }}</p></template
          >
          <template v-if="cfg.interactions" #interactions>
            <vd-btn icon="heart" color="danger" />
            <vd-btn color="primary" prepend-icon="message-circle">54</vd-btn>
          </template>
        </vd-card>
      </div>

      <div class="pg__config">
        <p class="pg__config-title">Configuration</p>
        <vd-input v-model="cfg.title" label="Title" label-placeholder />
        <vd-input v-model="cfg.text" label="Text" label-placeholder />
        <vd-select v-model="cfg.image" :items="images" label="Image" />
        <div class="pg__checks">
          <vd-checkbox v-model="cfg.interactions" label="Interactions" />
        </div>
        <div v-if="type === '6'" class="pg__slider">
          <p class="pg__config-title">Parallax intensity — {{ cfg.parallax }}px</p>
          <vd-slider v-model="cfg.parallax" :min="20" :max="600" :step="10" color="primary" />
        </div>
      </div>
    </div>

    <Markup :code="code" lang="markup" />
  </div>
</template>
