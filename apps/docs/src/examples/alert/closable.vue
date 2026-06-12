<script setup>
import { ref } from 'vue'
const active = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px">
    <vd-btn variant="flat" @click="active = !active">
      {{ active ? 'Close alert' : 'Open alert' }}
    </vd-btn>
    <vd-alert v-model="active" closable color="primary">
      <template #title>Vue DL Framework</template>
      Dismiss me with the close button, or toggle me from the button above.
    </vd-alert>
  </div>
</template>
