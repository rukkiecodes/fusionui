<script setup lang="ts">
import { ref } from 'vue'

const appointment = ref<string | null>(null)

// Consultations run on the quarter hour, inside office hours.
function quarterHours(minute: number): boolean {
  return minute % 15 === 0
}
</script>

<template>
  <div class="w">
    <f-time-picker
      v-model="appointment"
      min="09:00"
      max="17:00"
      :allowed-minutes="quarterHours"
      title="Book a consultation"
    />
    <code>{{ appointment ?? 'No slot chosen' }}</code>
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
