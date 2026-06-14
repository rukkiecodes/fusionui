<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-btn @click="open = true">Open wide dialog</f-btn>

  <f-dialog v-model="open" :width="640">
    <template #header><h4 style="margin: 0">Custom width</h4></template>
    <p style="margin: 0; opacity: 0.8">
      Pass <code>width</code> (a number of pixels or any CSS length) to size the dialog.
    </p>
    <template #footer>
      <f-btn @click="open = false">Close</f-btn>
    </template>
  </f-dialog>
</template>
