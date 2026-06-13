<script setup>
import { ref } from 'vue'
const active = ref(false)
const progress = ref(0)

function open() {
  active.value = true
  progress.value = 0
  const time = 5000
  const iv = setInterval(() => progress.value++, time / 100)
  setTimeout(() => {
    active.value = false
    clearInterval(iv)
  }, time)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px">
    <f-btn variant="flat" @click="open">Open alert (5s)</f-btn>
    <f-alert v-model="active" :progress="progress" color="primary">
      <template #title>Auto-closing</template>
      This alert dismisses itself when the progress bar fills up.
    </f-alert>
  </div>
</template>
