<script setup>
import { ref } from 'vue'
const name = ref('')
</script>

<template>
  <f-input v-model="name" placeholder="Type your name…" />
</template>
