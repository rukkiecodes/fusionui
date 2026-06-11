<script setup>
import { ref } from 'vue'

const loading = ref(false)

function submit() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <div class="d-flex" style="gap: 12px; flex-wrap: wrap; align-items: center">
    <vd-btn color="primary">Primary</vd-btn>
    <vd-btn color="success">Success</vd-btn>
    <vd-btn color="danger">Danger</vd-btn>
    <vd-btn color="warning">Warning</vd-btn>
    <vd-btn icon="$success" color="success" />
    <vd-btn :loading="loading" prepend-icon="upload" @click="submit">Upload</vd-btn>
  </div>
</template>
