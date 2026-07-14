<script setup lang="ts">
const items = [
  { title: 'Dashboard', href: '#' },
  { title: 'Billing', href: '#' },
  { title: 'Invoices', href: '#' },
  { title: 'INV-2043' },
]
</script>

<template>
  <f-breadcrumb :items="items" />
</template>
