<script setup lang="ts">
import { ref } from 'vue'

const seats = ref(12)
const replicas = ref(3)
const retention = ref(30)
</script>

<template>
  <div class="stack">
    <label class="field">
      <span class="field__label">Seats — {{ seats }}</span>
      <f-input-number v-model="seats" :min="1" :max="200" />
    </label>

    <label class="field">
      <span class="field__label">Replicas (min 1, max 8)</span>
      <f-input-number v-model="replicas" :min="1" :max="8" color="success" />
    </label>

    <label class="field">
      <span class="field__label">Log retention in days (step 15)</span>
      <f-input-number v-model="retention" :min="0" :max="90" :step="15" />
    </label>

    <label class="field">
      <span class="field__label">Included seats (fixed on this plan)</span>
      <f-input-number :model-value="3" disabled />
    </label>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 360px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
