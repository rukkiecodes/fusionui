<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(3)
</script>

<template>
  <div class="row">
    <f-rating v-model="rating" aria-label="Rate this article" />
    <span class="value">{{ rating }} / 5</span>
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
