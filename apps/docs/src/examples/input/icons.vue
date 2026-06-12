<script setup>
import { ref } from 'vue'
const search = ref('')
const user = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <vd-input v-model="search" label="Search" label-placeholder prepend-icon="search" />
    <vd-input v-model="user" label="Username" label-placeholder prepend-icon="user" clearable />
    <vd-input v-model="user" label="Website" label-placeholder append-icon="link" />
  </div>
</template>
