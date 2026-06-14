<script setup>
import { ref } from 'vue'
const open = ref(false)
const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 1600)
}
</script>

<template>
  <f-btn @click="open = true">Open dialog</f-btn>

  <f-dialog v-model="open" :loading="loading">
    <template #header><h4 style="margin: 0">Save changes?</h4></template>
    <p style="margin: 0; opacity: 0.8">A spinner covers the dialog while the action runs.</p>
    <template #footer>
      <f-btn variant="text" @click="open = false">Cancel</f-btn>
      <f-btn color="primary" @click="submit">Save</f-btn>
    </template>
  </f-dialog>
</template>
