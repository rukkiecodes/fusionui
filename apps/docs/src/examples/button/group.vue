<script setup>
import { ref } from 'vue'
const view = ref('grid')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <f-btn-group v-model="view" divided>
      <f-btn value="list" prepend-icon="list">List</f-btn>
      <f-btn value="grid" prepend-icon="grid">Grid</f-btn>
      <f-btn value="columns" prepend-icon="columns">Columns</f-btn>
    </f-btn-group>
    <span style="opacity: 0.6; font-size: 0.9rem">Selected: {{ view }}</span>
  </div>
</template>
