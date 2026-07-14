<script setup lang="ts">
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<template>
  <div class="w">
    <f-date-picker v-model="date" />
    <code>{{ date ? date.toDateString() : 'No date selected' }}</code>
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
