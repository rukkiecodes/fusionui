<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <div class="w">
    <f-upload v-model="files" disabled text="Uploads are paused while your plan is past due" />
    <p class="hint">Settle the outstanding invoice to re-enable uploads.</p>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
