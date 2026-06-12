<script setup>
import { ref } from 'vue'
const a = ref('')
const b = ref('')
const c = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 22px; max-width: 360px">
    <vd-input v-model="a" label="Default" label-placeholder variant="default" />
    <vd-input v-model="b" label="Underlined" label-placeholder variant="underlined" />
    <vd-input v-model="c" label="Shadow" label-placeholder variant="shadow" />
  </div>
</template>
