<script setup lang="ts">
import { ref } from 'vue'

const rating = ref(2)
</script>

<template>
  <f-rating v-model="rating" hover aria-label="Rate your delivery" />
</template>
