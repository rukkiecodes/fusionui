<script setup>
import { ref } from 'vue'
const code = ref('')
</script>

<template>
  <f-otp v-model="code" :length="6" separator="-" />
</template>
