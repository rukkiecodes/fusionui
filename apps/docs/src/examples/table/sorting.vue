<script setup lang="ts">
const headers = [
  { title: 'Product', key: 'product', sortable: true },
  { title: 'Units sold', key: 'units', sortable: true, align: 'end' as const },
  { title: 'Revenue', key: 'revenue', sortable: true, align: 'end' as const },
]

const items = [
  { product: 'Starter plan', units: 1240, revenue: 12400 },
  { product: 'Team plan', units: 386, revenue: 34740 },
  { product: 'Enterprise plan', units: 42, revenue: 58800 },
  { product: 'Add-on storage', units: 917, revenue: 4585 },
]
</script>

<template>
  <f-table :headers="headers" :items="items" />
</template>
