<script setup lang="ts">
const headers = [
  { title: 'Invoice', key: 'invoice' },
  { title: 'Customer', key: 'customer' },
  { title: 'Amount', key: 'amount', align: 'end' as const },
]
</script>

<template>
  <f-table :headers="headers" :items="[]">
    <template #empty>
      <f-empty-state
        icon="search"
        title="No invoices found"
        text="Nothing matches the current filters. Try widening the date range."
      />
    </template>
  </f-table>
</template>
