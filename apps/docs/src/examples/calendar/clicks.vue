<script setup lang="ts">
import { ref } from 'vue'
import type { FCalendarEvent } from '@rukkiecodes/vue'

const focused = ref(new Date())
const log = ref('Click a day or an event.')

function day(offset: number, hour = 9) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, 0, 0, 0)
  return d
}

const events = [
  { id: 'evt_1', title: 'Design review', start: day(0, 10), color: '#6366f1' },
  { id: 'evt_2', title: 'Ship v2.1', start: day(2), allDay: true, color: '#10b981' },
]

function onDate(date: Date) {
  log.value = `Day: ${date.toDateString()}`
}

function onEvent(event: FCalendarEvent) {
  // The original object comes back untouched — including your own `id`.
  log.value = `Event: ${event.title} (${event.id})`
}
</script>

<template>
  <div class="stack">
    <f-calendar v-model="focused" :events="events" @click:date="onDate" @click:event="onEvent" />
    <f-alert color="primary" variant="tonal">{{ log }}</f-alert>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
