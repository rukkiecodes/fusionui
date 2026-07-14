<script setup lang="ts">
import { ref } from 'vue'

const mine = ref(3)
</script>

<template>
  <div class="stack">
    <div class="row">
      <f-rating :model-value="4.5" half-increments readonly aria-label="Average rating" />
      <span class="muted">4.5 average — 1,284 reviews</span>
    </div>

    <div class="row">
      <f-rating v-model="mine" clearable hover aria-label="Your rating" />
      <span class="muted">
        {{ mine ? `You rated this ${mine}` : 'Click a star, or the same star again to clear' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.muted {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
