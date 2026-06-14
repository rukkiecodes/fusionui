<script setup>
import { ref } from 'vue'
const value = ref(null)
const items = [
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Denmark',
  'Egypt',
  'France',
  'Germany',
  'Greece',
  'India',
  'Indonesia',
  'Italy',
  'Japan',
  'Mexico',
  'Netherlands',
  'Norway',
  'Portugal',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'Ukraine',
]
</script>

<template>
  <div class="w">
    <f-select
      v-model="value"
      :items="items"
      filter
      label="Country"
      placeholder="Search a country"
    />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}
</style>
