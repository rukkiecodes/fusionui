<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-btn @click="open = true">Open long dialog</f-btn>

  <f-dialog v-model="open" scroll>
    <template #header><h4 style="margin: 0">Terms of service</h4></template>
    <p v-for="n in 24" :key="n" style="margin: 0 0 12px; opacity: 0.8">
      {{ n }}. The content area scrolls inside the dialog when it gets tall, keeping the header,
      footer and close button in place.
    </p>
    <template #footer>
      <f-btn variant="text" @click="open = false">Decline</f-btn>
      <f-btn @click="open = false">Accept</f-btn>
    </template>
  </f-dialog>
</template>
