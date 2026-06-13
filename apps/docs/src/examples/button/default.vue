<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <div class="d-flex" style="gap: 12px; align-items: center">
    <f-btn :active="active === 0" @click="active = 0">Active</f-btn>
    <f-btn :active="active === 1" @click="active = 1">Default</f-btn>
    <f-btn disabled>Disabled</f-btn>
  </div>
</template>
