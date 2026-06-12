<script setup>
import { ref } from 'vue'
const v = ref('')
</script>

<template>
  <vd-input v-model="v" placeholder="Name" loading />
</template>
