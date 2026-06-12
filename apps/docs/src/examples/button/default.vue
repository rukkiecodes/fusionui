<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <div class="d-flex" style="gap: 12px; align-items: center">
    <vd-btn :active="active === 0" @click="active = 0">Active</vd-btn>
    <vd-btn :active="active === 1" @click="active = 1">Default</vd-btn>
    <vd-btn disabled>Disabled</vd-btn>
  </div>
</template>
