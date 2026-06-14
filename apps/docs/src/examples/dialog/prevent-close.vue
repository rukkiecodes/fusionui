<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-btn color="danger" @click="open = true">Open (prevent close)</f-btn>

  <f-dialog v-model="open" prevent-close>
    <template #header><h4 style="margin: 0">Confirm to proceed</h4></template>
    <p style="margin: 0; opacity: 0.8">
      Clicking the backdrop won't dismiss this — it nudges instead. Use a button.
    </p>
    <template #footer>
      <f-btn variant="text" @click="open = false">Cancel</f-btn>
      <f-btn color="danger" @click="open = false">Delete</f-btn>
    </template>
  </f-dialog>
</template>
