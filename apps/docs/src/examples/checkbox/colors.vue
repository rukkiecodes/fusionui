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
    <f-checkbox v-model="a" color="primary">Primary</f-checkbox>
    <f-checkbox v-model="b" color="success">Success</f-checkbox>
    <f-checkbox v-model="c" color="danger">Danger</f-checkbox>
    <f-checkbox v-model="d" color="warning">Warning</f-checkbox>
    <f-checkbox v-model="e" color="#7d33ff">#7d33ff</f-checkbox>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
