<script setup lang="ts">
const items = [
  { title: 'Store', href: '#' },
  { title: 'Headphones', href: '#' },
  { title: 'Studio Pro' },
]
</script>

<template>
  <f-breadcrumb :items="items">
    <template #divider>/</template>
  </f-breadcrumb>
</template>
