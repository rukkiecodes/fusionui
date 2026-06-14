<script setup>
import { ref } from 'vue'
const selected = ref(['vue'])
</script>

<template>
  <div class="col">
    <div class="row">
      <f-checkbox v-model="selected" value="vue">Vue</f-checkbox>
      <f-checkbox v-model="selected" value="react">React</f-checkbox>
      <f-checkbox v-model="selected" value="svelte">Svelte</f-checkbox>
      <f-checkbox v-model="selected" value="solid">Solid</f-checkbox>
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
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
