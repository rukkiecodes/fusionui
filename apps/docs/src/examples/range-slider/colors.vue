<script setup lang="ts">
import { ref } from 'vue'

const a = ref([25, 75])
const b = ref([10, 60])
const c = ref([30, 90])
</script>

<template>
  <div class="stack">
    <f-range-slider v-model="a" color="primary" />
    <f-range-slider v-model="b" color="success" />
    <f-range-slider v-model="c" color="danger" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 420px;
}
</style>
