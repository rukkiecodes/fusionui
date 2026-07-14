<script setup lang="ts">
import { ref } from 'vue'

const uploaded = ref(64)
</script>

<template>
  <div class="stack">
    <div class="row">
      <f-progress-circular indeterminate />
      <f-progress-circular :model-value="uploaded" color="success" />
      <f-progress-circular :model-value="uploaded" :size="56" :width="6" color="#6d28d9" />
    </div>

    <div class="bar">
      <span class="bar__label">Uploading build artifact — {{ uploaded }}%</span>
      <f-progress-linear :model-value="uploaded" color="primary" />
    </div>

    <div class="bar">
      <span class="bar__label">Waiting for the runner</span>
      <f-progress-linear indeterminate color="warning" />
    </div>

    <div class="bar">
      <span class="bar__label">Restoring cache</span>
      <f-progress-linear :model-value="38" :height="10" striped color="success" />
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar__label {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
