<script setup lang="ts">
import { ref } from 'vue'

const sprint = ref<Date | null>(null)
</script>

<template>
  <div class="w">
    <f-date-picker
      v-model="sprint"
      show-week
      show-adjacent-months
      :first-day-of-week="1"
      locale="en-GB"
      title="Sprint starts"
      header-format="dddd, D MMMM"
    />
    <code>{{ sprint ? sprint.toDateString() : 'Not scheduled' }}</code>
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
