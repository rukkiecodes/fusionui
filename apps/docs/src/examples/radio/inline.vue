<script setup>
import { ref } from 'vue'
const size = ref('m')
</script>

<template>
  <f-radio-group v-model="size" inline label="Size">
    <f-radio value="s">Small</f-radio>
    <f-radio value="m">Medium</f-radio>
    <f-radio value="l">Large</f-radio>
  </f-radio-group>
</template>
