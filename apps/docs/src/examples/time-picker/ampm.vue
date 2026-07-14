<script setup lang="ts">
import { ref } from 'vue'

// The model is always 24-hour, whatever the columns display.
const doors = ref<string | null>('19:00')
</script>

<template>
  <div class="w">
    <f-time-picker v-model="doors" format="ampm" color="danger" title="Doors open" />
    <code>{{ doors ?? 'null' }}</code>
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
