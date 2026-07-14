<script setup lang="ts">
import { ref } from 'vue'

const temperature = ref(21)
</script>

<template>
  <div class="w">
    <label class="label"
      >Thermostat <span>{{ temperature }}°C</span></label
    >
    <f-slider v-model="temperature" :min="16" :max="28" :step="0.5" />
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
</style>
