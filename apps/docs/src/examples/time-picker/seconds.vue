<script setup lang="ts">
import { ref } from 'vue'

const start = ref<string | null>('00:01:30')
</script>

<template>
  <div class="w">
    <f-time-picker v-model="start" use-seconds scrollable color="success" title="Clip starts at" />
    <code>{{ start ?? 'null' }}</code>
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
