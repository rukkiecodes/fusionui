<script setup lang="ts">
import { ref } from 'vue'

const focused = ref(new Date())

function day(offset: number, hour = 9) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, 0, 0, 0)
  return d
}

const events = [
  { title: 'Incident review', start: day(-1, 15), color: '#ef4444' },
  { title: 'Release', start: day(1), allDay: true, color: '#10b981' },
  { title: 'Roadmap sync', start: day(3, 13), color: '#6366f1' },
  { title: 'On-call handover', start: day(5, 9), color: '#f59e0b' },
]
</script>

<template>
  <f-calendar v-model="focused" :events="events" />
</template>
