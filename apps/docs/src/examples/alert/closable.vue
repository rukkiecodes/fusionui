<script setup>
import { ref } from 'vue'
const active = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px">
    <f-btn variant="flat" @click="active = !active">
      {{ active ? 'Close alert' : 'Open alert' }}
    </f-btn>
    <f-alert v-model="active" closable color="primary">
      <template #title>FusionUI Framework</template>
      Dismiss me with the close button, or toggle me from the button above.
    </f-alert>
  </div>
</template>
