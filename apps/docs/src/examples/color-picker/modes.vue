<script setup lang="ts">
import { ref } from 'vue'
import type { ColorPickerMode } from '@rukkiecodes/vue'

// The value keeps the shape it started with — an rgba() string stays an rgba()
// string, a { r, g, b } object stays an object.
const overlay = ref('rgba(109, 40, 217, 0.8)')
const mode = ref<ColorPickerMode>('rgba')
</script>

<template>
  <div class="w">
    <f-color-picker
      v-model="overlay"
      v-model:mode="mode"
      :modes="['hexa', 'rgba', 'hsla']"
      :canvas-height="120"
    />
    <code>{{ overlay }}</code>
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
