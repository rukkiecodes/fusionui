<script setup lang="ts">
import { ref } from 'vue'

const muted = ref(false)
const pinned = ref(true)
</script>

<template>
  <div class="row">
    <f-icon-btn
      :icon="muted ? 'volume-x' : 'volume-2'"
      :aria-label="muted ? 'Unmute' : 'Mute'"
      :active="muted"
      variant="tonal"
      @click="muted = !muted"
    />
    <f-icon-btn
      icon="bookmark"
      aria-label="Pin to sidebar"
      :active="pinned"
      variant="tonal"
      color="primary"
      @click="pinned = !pinned"
    />
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
