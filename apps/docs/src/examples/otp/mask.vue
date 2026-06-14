<script setup>
import { ref } from 'vue'
const pin = ref('')
</script>

<template>
  <f-otp v-model="pin" :length="4" mask color="success" />
</template>
