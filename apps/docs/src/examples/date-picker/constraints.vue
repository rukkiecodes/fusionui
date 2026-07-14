<script setup lang="ts">
import { ref } from 'vue'

const appointment = ref<Date | null>(null)

// Bookable from today, up to six weeks out — weekdays only.
const today = new Date()
const sixWeeks = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 42)

function isWeekday(date: Date): boolean {
  const day = date.getDay()
  return day !== 0 && day !== 6
}
</script>

<template>
  <div class="w">
    <f-date-picker
      v-model="appointment"
      :min="today"
      :max="sixWeeks"
      :allowed-dates="isWeekday"
      title="Book a fitting"
      header="Weekdays only"
    />
    <code>{{ appointment ? appointment.toDateString() : 'Nothing booked' }}</code>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
