<script setup>
import { ref } from 'vue'
const value = ref(null)
const items = [
  { header: 'Fruits' },
  'Apple',
  'Banana',
  'Orange',
  { header: 'Vegetables' },
  'Carrot',
  'Potato',
  'Spinach',
  { header: 'Grains' },
  'Rice',
  'Wheat',
]
</script>

<template>
  <div class="w">
    <f-select v-model="value" :items="items" filter label="Food" placeholder="Pick a food" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}
</style>
