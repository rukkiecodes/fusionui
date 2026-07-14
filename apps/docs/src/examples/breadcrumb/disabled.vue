<script setup lang="ts">
const items = [
  { title: 'Docs', href: '#' },
  { title: 'Components', disabled: true },
  { title: 'Breadcrumb' },
]
</script>

<template>
  <f-breadcrumb :items="items" />
</template>
