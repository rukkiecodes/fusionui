<script setup>
import { ref } from 'vue'
const active = ref(0)
</script>

<template>
  <div class="d-flex" style="gap: 12px; align-items: center">
    <f-btn variant="outlined" :active="active === 0" @click="active = 0">Active</f-btn>
    <f-btn variant="outlined" color="danger" :active="active === 1" @click="active = 1">
      Default
    </f-btn>
    <f-btn variant="outlined" disabled>Disabled</f-btn>
  </div>
</template>
