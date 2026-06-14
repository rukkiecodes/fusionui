<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-btn @click="open = true">Open dialog</f-btn>

  <f-dialog v-model="open">
    <template #header><h4 style="margin: 0">Welcome back</h4></template>

    <p style="margin: 0; opacity: 0.8">
      Sign in to pick up where you left off. We kept your place.
    </p>

    <template #footer>
      <f-btn variant="text" @click="open = false">Cancel</f-btn>
      <f-btn @click="open = false">Continue</f-btn>
    </template>
  </f-dialog>
</template>
