<script setup>
import { ref } from 'vue'
const v = ref('Vue DL')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <vd-input v-model="v" label="Primary" label-placeholder color="primary" />
    <vd-input v-model="v" label="Success" label-placeholder color="success" />
    <vd-input v-model="v" label="Danger" label-placeholder color="danger" />
    <vd-input v-model="v" label="Custom" label-placeholder color="#8e2de2" />
  </div>
</template>
