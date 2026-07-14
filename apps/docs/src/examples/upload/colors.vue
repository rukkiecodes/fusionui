<script setup lang="ts">
import { ref } from 'vue'

const receipts = ref<File[]>([])
</script>

<template>
  <f-upload
    v-model="receipts"
    color="success"
    accept="application/pdf"
    text="Attach the signed contract (PDF)"
  />
</template>
