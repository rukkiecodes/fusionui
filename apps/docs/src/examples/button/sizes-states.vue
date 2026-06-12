<script setup>
import { ref } from 'vue'

const loading = ref(false)
function submit() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1600)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <div class="d-flex" style="gap: 10px; align-items: center; flex-wrap: wrap">
      <vd-btn size="x-small">x-small</vd-btn>
      <vd-btn size="small">small</vd-btn>
      <vd-btn>default</vd-btn>
      <vd-btn size="large">large</vd-btn>
      <vd-btn size="x-large">x-large</vd-btn>
    </div>

    <div class="d-flex" style="gap: 10px; align-items: center; flex-wrap: wrap">
      <vd-btn color="success">Success</vd-btn>
      <vd-btn color="danger" variant="tonal">Danger</vd-btn>
      <vd-btn color="warning" variant="flat">Warning</vd-btn>
      <vd-btn icon="heart" color="danger" variant="floating" />
      <vd-btn icon="settings" circle variant="tonal" />
      <vd-btn :loading="loading" prepend-icon="upload" @click="submit">Upload</vd-btn>
    </div>

    <div class="d-flex" style="gap: 10px; align-items: center; flex-wrap: wrap">
      <vd-btn color="primary" animation-type="horizontal">
        Hover me
        <template #animate><vd-icon icon="arrow-right" /></template>
      </vd-btn>
      <vd-btn color="success" variant="tonal" animation-type="scale">
        Add
        <template #animate><vd-icon icon="check" /></template>
      </vd-btn>
    </div>
  </div>
</template>
