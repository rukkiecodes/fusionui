<script setup>
import { ref } from 'vue'
const page = ref(3)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: center">
    <vd-breadcrumb
      :items="[
        { title: 'Home', href: '#' },
        { title: 'Components', href: '#' },
        { title: 'Pagination' },
      ]"
    />
    <vd-pagination v-model="page" :length="12" color="primary" />
    <span>Current page: {{ page }}</span>
  </div>
</template>
