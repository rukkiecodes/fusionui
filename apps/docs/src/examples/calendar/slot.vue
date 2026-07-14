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
  { title: 'Priya Raman', start: day(0, 10), role: 'Design review' },
  { title: 'Marcus Bell', start: day(2, 14), role: 'Interview' },
  { title: 'Jo Okafor', start: day(4, 11), role: '1:1' },
]
</script>

<template>
  <f-calendar v-model="focused" :events="events">
    <template #event="{ event }">
      <div class="evt">
        <f-avatar :text="String(event.title)" size="x-small" />
        <span class="evt__role">{{ event.role }}</span>
      </div>
    </template>
  </f-calendar>
</template>

<style scoped>
.evt {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px;
  min-width: 0;
}
.evt__role {
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
