<script setup>
import { ref } from 'vue'
const a = ref('Primary')
const b = ref('Success')
const c = ref('Custom')
const items = ['Primary', 'Success', 'Danger', 'Warning', 'Custom']
</script>

<template>
  <div class="w">
    <f-select v-model="a" :items="items" color="primary" label="Primary" class="s" />
    <f-select v-model="b" :items="items" color="success" label="Success" class="s" />
    <f-select v-model="c" :items="items" color="#7d33ff" label="#7d33ff" class="s" />
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
}
.s {
  width: 180px;
}
</style>
