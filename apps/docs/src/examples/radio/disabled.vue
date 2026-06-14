<script setup>
import { ref } from 'vue'
const v = ref('a')
</script>

<template>
  <f-radio-group v-model="v" disabled label="Disabled group">
    <f-radio value="a">Selected</f-radio>
    <f-radio value="b">Option B</f-radio>
  </f-radio-group>
</template>
