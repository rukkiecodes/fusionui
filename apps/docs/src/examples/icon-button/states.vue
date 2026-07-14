<script setup lang="ts">
import { ref } from 'vue'

const syncing = ref(false)

function sync(): void {
  syncing.value = true
  setTimeout(() => (syncing.value = false), 1600)
}
</script>

<template>
  <div class="row">
    <f-icon-btn
      icon="refresh-cw"
      aria-label="Sync now"
      color="primary"
      :loading="syncing"
      @click="sync"
    />
    <f-icon-btn icon="trash-2" aria-label="Delete" color="danger" disabled />
    <f-icon-btn icon="edit-2" aria-label="Edit" variant="outlined" disabled />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
