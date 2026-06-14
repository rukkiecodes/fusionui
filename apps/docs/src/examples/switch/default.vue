<script setup>
import { ref } from 'vue'
const on = ref(true)
</script>

<template>
  <div class="col">
    <f-switch v-model="on">Notifications</f-switch>
    <code>{{ on }}</code>
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
