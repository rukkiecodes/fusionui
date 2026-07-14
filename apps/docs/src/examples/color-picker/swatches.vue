<script setup lang="ts">
import { ref } from 'vue'

const label = ref('#16a34a')

// The palette a team is actually allowed to use.
const palette = [
  '#0f172a',
  '#334155',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#db2777',
]
</script>

<template>
  <div class="w">
    <f-color-picker v-model="label" mode="hex" show-swatches :swatches="palette" />
    <code>{{ label }}</code>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
