<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watchEffect } from 'vue'

const props = defineProps<{ file: string }>()

// Vite globs every example once; we pick the one matching `file` at runtime.
const componentModules = import.meta.glob('../examples/**/*.vue')
const sourceModules = import.meta.glob('../examples/**/*.vue', {
  query: '?raw',
  import: 'default',
})

const showCode = ref(false)
const copied = ref(false)
const source = ref('')

const key = computed(() => `../examples/${props.file}.vue`)

const Comp = computed(() => {
  const loader = componentModules[key.value]
  return loader ? defineAsyncComponent(loader as never) : null
})

watchEffect(async () => {
  const loader = sourceModules[key.value]
  source.value = loader ? ((await loader()) as string) : ''
})

async function copy() {
  await navigator.clipboard.writeText(source.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="example">
    <div class="example__preview">
      <component :is="Comp" v-if="Comp" />
      <div v-else class="example__missing">Example "{{ file }}" not found.</div>
    </div>

    <div class="example__toolbar">
      <vd-btn size="x-small" variant="text" prepend-icon="code" @click="showCode = !showCode">
        {{ showCode ? 'Hide' : 'Show' }} source
      </vd-btn>
      <vd-spacer />
      <vd-btn size="x-small" variant="text" :prepend-icon="copied ? 'check' : 'copy'" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </vd-btn>
    </div>

    <Markup v-if="showCode" :code="source" />
  </div>
</template>
