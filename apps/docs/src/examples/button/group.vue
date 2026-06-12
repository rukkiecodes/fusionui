<script setup>
import { ref } from 'vue'
const view = ref('grid')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <vd-btn-group v-model="view" divided>
      <vd-btn value="list" prepend-icon="list">List</vd-btn>
      <vd-btn value="grid" prepend-icon="grid">Grid</vd-btn>
      <vd-btn value="columns" prepend-icon="columns">Columns</vd-btn>
    </vd-btn-group>
    <span style="opacity: 0.6; font-size: 0.9rem">Selected: {{ view }}</span>
  </div>
</template>
