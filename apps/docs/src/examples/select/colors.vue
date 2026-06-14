<script setup>
import { ref } from 'vue'
const a = ref('Primary')
const b = ref('Success')
const c = ref('Custom')
const items = ['Primary', 'Success', 'Danger', 'Warning', 'Custom']
</script>

<template>
  <div class="w">
    <f-select v-model="a" :items="items" color="primary" label="Primary" />
    <f-select v-model="b" :items="items" color="success" label="Success" />
    <f-select v-model="c" :items="items" color="#7d33ff" label="#7d33ff" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
