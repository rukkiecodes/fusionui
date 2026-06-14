<script setup>
import { ref } from 'vue'
const selected = ref(['wifi'])
</script>

<template>
  <div class="col">
    <div class="rows">
      <f-switch v-model="selected" val="wifi">Wi-Fi</f-switch>
      <f-switch v-model="selected" val="bluetooth">Bluetooth</f-switch>
      <f-switch v-model="selected" val="airplane">Airplane mode</f-switch>
    </div>
    <code>{{ selected }}</code>
  </div>
</template>

<style scoped>
.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
