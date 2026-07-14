<script setup lang="ts">
import { ref } from 'vue'
import type { FCalendarViewMode } from '@rukkiecodes/vue'

const focused = ref(new Date())
const view = ref<FCalendarViewMode>('month')

function day(offset: number, hour = 9) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, 0, 0, 0)
  return d
}

const events = [
  { title: 'Kickoff', start: day(0, 9), color: '#6366f1' },
  { title: 'Design review', start: day(0, 11), color: '#10b981' },
  { title: 'Interview', start: day(0, 14), color: '#f59e0b' },
  { title: 'Retro', start: day(0, 16), color: '#ec4899' },
  { title: 'Deploy window', start: day(1, 20), color: '#ef4444' },
]
</script>

<template>
  <div class="stack">
    <f-btn-toggle v-model="view" mandatory variant="outlined" color="primary">
      <f-btn value="month">Month</f-btn>
      <f-btn value="week">Week</f-btn>
      <f-btn value="day">Day</f-btn>
    </f-btn-toggle>

    <f-calendar v-model="focused" v-model:view-mode="view" :events="events" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
