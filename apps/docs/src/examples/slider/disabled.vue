<script setup lang="ts">
import { ref } from 'vue'

const seats = ref(25)
</script>

<template>
  <div class="w">
    <label class="label"
      >Seats <span>{{ seats }} / 100</span></label
    >
    <f-slider v-model="seats" disabled />
    <p class="hint">Seat count is managed by your billing owner.</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
.label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  opacity: 0.8;
}
.hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
