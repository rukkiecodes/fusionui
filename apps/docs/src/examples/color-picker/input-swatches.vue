<script setup lang="ts">
import { ref } from 'vue'

const calendar = ref('#0891b2')
const palette = [
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
    <f-color-input
      v-model="calendar"
      mode="hex"
      show-swatches
      :swatches="palette"
      hide-canvas
      hide-sliders
      hide-inputs
      label="Calendar color"
      variant="shadow"
      block
    />
    <code>{{ calendar ?? 'null' }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
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
