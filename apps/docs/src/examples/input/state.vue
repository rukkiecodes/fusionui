<script setup>
import { ref } from 'vue'
const a = ref('Looks good!')
const b = ref('Wrong value')
const c = ref('Be careful')
const d = ref('Heads up')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 18px; max-width: 320px">
    <vd-input v-model="a" label="Success" label-placeholder state="success" />
    <vd-input v-model="b" label="Danger" label-placeholder state="danger" />
    <vd-input v-model="c" label="Warning" label-placeholder state="warning" />
    <vd-input v-model="d" label="Primary" label-placeholder state="primary" />
  </div>
</template>
