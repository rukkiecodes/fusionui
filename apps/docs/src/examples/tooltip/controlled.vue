<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <f-tooltip v-model="open" not-hover text="Toggled by the button" color="primary">
    <f-btn @click="open = !open">{{ open ? 'Hide' : 'Show' }} tooltip</f-btn>
  </f-tooltip>
</template>
