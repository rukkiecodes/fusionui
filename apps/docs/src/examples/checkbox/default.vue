<script setup>
import { ref } from 'vue'
const checked = ref(true)
</script>

<template>
  <div class="col">
    <f-checkbox v-model="checked">Accept the terms</f-checkbox>
    <code>{{ checked }}</code>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
