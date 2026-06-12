<script setup>
import { ref } from 'vue'
const v = ref('checking…')
</script>

<template>
  <vd-input
    v-model="v"
    label="Username"
    label-placeholder
    loading
    prepend-icon="user"
    style="max-width: 360px"
  />
</template>
