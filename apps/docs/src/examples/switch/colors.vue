<script setup>
import { ref } from 'vue'
const a = ref(true)
const b = ref(true)
const c = ref(true)
const d = ref(true)
const e = ref(true)
</script>

<template>
  <div class="row">
    <f-switch v-model="a" color="primary" />
    <f-switch v-model="b" color="success" />
    <f-switch v-model="c" color="danger" />
    <f-switch v-model="d" color="warning" />
    <f-switch v-model="e" color="#7d33ff" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
}
</style>
