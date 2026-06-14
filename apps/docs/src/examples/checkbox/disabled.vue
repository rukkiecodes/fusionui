<script setup>
import { ref } from 'vue'
const a = ref(true)
const b = ref(false)
</script>

<template>
  <div class="row">
    <f-checkbox v-model="a" disabled>Checked &amp; disabled</f-checkbox>
    <f-checkbox v-model="b" disabled>Unchecked &amp; disabled</f-checkbox>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}
</style>
