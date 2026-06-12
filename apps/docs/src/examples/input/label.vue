<script setup>
import { ref } from 'vue'
const a = ref('')
const b = ref('')
</script>

<template>
  <div style="display: flex; gap: 24px; flex-wrap: wrap">
    <vd-input v-model="a" label="Top label" placeholder="Email" />
    <vd-input v-model="b" label="Floating label" label-placeholder />
  </div>
</template>
