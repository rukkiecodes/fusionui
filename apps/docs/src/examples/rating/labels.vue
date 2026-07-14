<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(4)
const labels = ['Awful', 'Poor', 'OK', 'Good', 'Great']
</script>

<template>
  <f-rating
    v-model="rating"
    :item-labels="labels"
    hover
    aria-label="How was your stay?"
    :item-aria-label="(value: number) => labels[value - 1]"
  />
</template>
