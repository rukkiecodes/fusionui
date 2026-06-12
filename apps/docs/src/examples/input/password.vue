<script setup>
import { ref } from 'vue'
const pw = ref('s3cr3t')
</script>

<template>
  <vd-input
    v-model="pw"
    type="password"
    label="Password"
    label-placeholder
    prepend-icon="lock"
    style="max-width: 360px"
  />
</template>
