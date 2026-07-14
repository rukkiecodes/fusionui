<script setup lang="ts">
import { ref } from 'vue'

const hours = ref([9, 17])
</script>

<template>
  <div class="wrap">
    <div class="label">
      <span>Working hours</span>
      <strong>{{ hours[0] }}:00 – {{ hours[1] }}:00</strong>
    </div>
    <f-range-slider
      v-model="hours"
      :min="0"
      :max="24"
      :step="1"
      :thumb-labels="['Start of day', 'End of day']"
    />
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  max-width: 420px;
}
.label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 4px;
}
</style>
