<script setup lang="ts">
import { ref } from 'vue'

const trip = ref<Date[]>([])
const today = new Date()
</script>

<template>
  <div class="w">
    <f-date-input
      v-model="trip"
      range
      :min="today"
      format="MMM D"
      label="Travel dates"
      placeholder="Depart – return"
      prepend-icon="calendar"
      color="success"
      clearable
      block
    />
    <code>{{ trip.length ? trip.map(d => d.toDateString()).join(' → ') : 'No dates yet' }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
code {
  width: 100%;
  max-width: 100%;
  text-align: center;
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
}
</style>
