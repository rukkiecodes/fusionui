<script setup lang="ts">
import { ref } from 'vue'

const accent = ref('#7c3aed')
</script>

<template>
  <div class="w">
    <f-color-input
      v-model="accent"
      label="Accent color"
      hint="Paste a hex value, or open the picker"
      persistent-hint
      clearable
      block
    />
    <code>{{ accent ?? 'null' }}</code>
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
