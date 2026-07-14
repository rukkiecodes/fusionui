<script setup lang="ts">
import { ref } from 'vue'

const focused = ref(new Date())

// Build the events around today so the example always has something to show.
function day(offset: number, hour = 9) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, 0, 0, 0)
  return d
}

const events = [
  { title: 'Design review', start: day(0, 10), color: '#6366f1' },
  { title: 'Standup', start: day(1, 9), color: '#10b981' },
  { title: 'Ship v2.1', start: day(2), allDay: true, color: '#f59e0b' },
  { title: '1:1 with Priya', start: day(4, 14), color: '#ec4899' },
  { title: 'Retro', start: day(6, 16), color: '#6366f1' },
]
</script>

<template>
  <f-calendar v-model="focused" :events="events" />
</template>
