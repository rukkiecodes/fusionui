<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-btn @click="open = true">Open full screen</f-btn>

  <f-dialog v-model="open" full-screen>
    <template #header><h4 style="margin: 0">Full screen</h4></template>
    <p style="margin: 0; opacity: 0.8">
      <code>full-screen</code> expands the dialog to fill the viewport (minus a small inset).
    </p>
    <template #footer>
      <f-btn @click="open = false">Close</f-btn>
    </template>
  </f-dialog>
</template>
