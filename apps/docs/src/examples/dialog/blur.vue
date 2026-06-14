<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-btn color="primary" @click="open = true">Open with blur</f-btn>

  <f-dialog v-model="open" blur>
    <template #header><h4 style="margin: 0">Frosted backdrop</h4></template>
    <p style="margin: 0; opacity: 0.8">
      <code>blur</code> frosts everything behind the dialog with a saturated blur.
    </p>
    <template #footer>
      <f-btn @click="open = false">Got it</f-btn>
    </template>
  </f-dialog>
</template>
