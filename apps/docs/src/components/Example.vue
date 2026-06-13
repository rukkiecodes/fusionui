<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watchEffect } from 'vue'

const props = defineProps<{ file: string }>()

const componentModules = import.meta.glob('../examples/**/*.vue')
const sourceModules = import.meta.glob('../examples/**/*.vue', {
  query: '?raw',
  import: 'default',
})

const showCode = ref(false)
const copied = ref(false)
const source = ref('')
const tab = ref<'template' | 'script' | 'all'>('template')

const key = computed(() => `../examples/${props.file}.vue`)

const Comp = computed(() => {
  const loader = componentModules[key.value]
  return loader ? defineAsyncComponent(loader as never) : null
})

watchEffect(async () => {
  const loader = sourceModules[key.value]
  source.value = loader ? ((await loader()) as string) : ''
})

const templateBlock = computed(() => {
  const m = source.value.match(/<template>[\s\S]*<\/template>/)
  return m ? m[0] : source.value.trim()
})
const scriptBlock = computed(() => {
  const m = source.value.match(/<script[\s\S]*?<\/script>/)
  return m ? m[0] : ''
})
const hasScript = computed(() => !!scriptBlock.value)
const tabs = computed(() =>
  hasScript.value ? (['template', 'script', 'all'] as const) : (['template'] as const)
)

const shownCode = computed(() => {
  if (tab.value === 'script') return scriptBlock.value
  if (tab.value === 'all') return source.value.trim()
  return templateBlock.value
})

function toggleCode() {
  showCode.value = !showCode.value
  if (showCode.value) tab.value = 'template'
}

async function copy() {
  await navigator.clipboard.writeText(source.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="example" :class="{ 'example--open': showCode }">
    <div class="example__preview">
      <component :is="Comp" v-if="Comp" />
      <div v-else class="example__missing">Example "{{ file }}" not found.</div>
    </div>

    <div class="example__toolbar">
      <button
        class="example__tool"
        :title="copied ? 'Copied' : 'Copy source'"
        :aria-label="copied ? 'Copied' : 'Copy source'"
        @click="copy"
      >
        <f-icon :icon="copied ? 'check' : 'copy'" size="small" />
      </button>
      <span class="example__divider" />
      <button
        class="example__tool"
        :class="{ 'example__tool--active': showCode }"
        title="Toggle source"
        aria-label="Toggle source code"
        @click="toggleCode"
      >
        <f-icon :icon="showCode ? 'eye-off' : 'code'" size="small" />
      </button>
    </div>

    <div v-if="showCode" class="example__code">
      <div class="example__tabs">
        <button
          v-for="t in tabs"
          :key="t"
          class="example__tab"
          :class="{ 'example__tab--active': tab === t }"
          @click="tab = t"
        >
          {{ t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1) }}
        </button>
      </div>
      <div class="example__panel">
        <span class="example__lang">vue</span>
        <Markup :code="shownCode" lang="markup" />
      </div>
    </div>
  </div>
</template>
