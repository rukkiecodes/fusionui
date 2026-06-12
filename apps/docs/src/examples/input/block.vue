<script setup>
import { ref } from 'vue'
const v = ref('')
</script>

<template>
  <vd-input v-model="v" label="Full width" label-placeholder block prepend-icon="mail" />
</template>
