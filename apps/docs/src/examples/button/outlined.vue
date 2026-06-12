<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <div class="d-flex" style="gap: 12px; align-items: center">
    <vd-btn variant="outlined" :active="active === 0" @click="active = 0">Active</vd-btn>
    <vd-btn variant="outlined" color="danger" :active="active === 1" @click="active = 1">
      Default
    </vd-btn>
    <vd-btn variant="outlined" disabled>Disabled</vd-btn>
  </div>
</template>
