<script setup>
import { ref } from 'vue'

const loading = ref(false)
const uploading = ref(false)

function load() {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}
function upload() {
  uploading.value = true
  setTimeout(() => (uploading.value = false), 2500)
}
</script>

<template>
  <div class="d-flex" style="gap: 12px; align-items: center; flex-wrap: wrap">
    <vd-btn :loading="loading" @click="load">Save</vd-btn>
    <vd-btn :loading="loading" color="success" variant="tonal" @click="load">Submit</vd-btn>
    <vd-btn :upload="uploading" color="primary" prepend-icon="upload" @click="upload"
      >Upload</vd-btn
    >
  </div>
</template>
