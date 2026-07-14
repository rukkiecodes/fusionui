<script setup lang="ts">
const headers = [
  { title: 'Invoice', key: 'invoice' },
  { title: 'Issued', key: 'issued', align: 'center' as const },
  { title: 'Amount', key: 'amount', align: 'end' as const },
]

const items = [
  { invoice: 'INV-2041', issued: '12 Mar 2026', amount: '$1,280.00' },
  { invoice: 'INV-2042', issued: '19 Mar 2026', amount: '$460.50' },
  { invoice: 'INV-2043', issued: '02 Apr 2026', amount: '$9,120.00' },
]
</script>

<template>
  <f-table :headers="headers" :items="items" />
</template>
