<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(3.5)
</script>

<template>
  <div class="row">
    <f-rating v-model="rating" half-increments hover aria-label="Rate this hotel" />
    <span class="value">{{ rating.toFixed(1) }}</span>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.value {
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
</style>
