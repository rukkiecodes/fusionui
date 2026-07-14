<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Invoice', key: 'number' },
  { title: 'Customer', key: 'customer' },
  { title: 'Due', key: 'due' },
  { title: 'Status', key: 'status' },
  { title: 'Amount', key: 'amount', align: 'end' },
]

const items = [
  {
    id: 'INV-2041',
    number: 'INV-2041',
    customer: 'Northwind Ltd',
    due: '2026-07-30',
    status: 'Open',
    amount: 4200,
  },
  {
    id: 'INV-2042',
    number: 'INV-2042',
    customer: 'Bluebird Co',
    due: '2026-08-02',
    status: 'Open',
    amount: 890,
  },
  {
    id: 'INV-2043',
    number: 'INV-2043',
    customer: 'Halcyon Media',
    due: '2026-06-18',
    status: 'Overdue',
    amount: 12400,
  },
  // Paid invoices cannot be selected — `item-selectable` reads this flag.
  {
    id: 'INV-2044',
    number: 'INV-2044',
    customer: 'Ridgeline Coffee',
    due: '2026-06-01',
    status: 'Paid',
    amount: 320,
    payable: false,
  },
  {
    id: 'INV-2045',
    number: 'INV-2045',
    customer: 'Aster Health',
    due: '2026-08-14',
    status: 'Open',
    amount: 7600,
  },
  {
    id: 'INV-2046',
    number: 'INV-2046',
    customer: 'Kestrel Logistics',
    due: '2026-08-20',
    status: 'Open',
    amount: 1580,
  },
].map(item => ({ payable: true, ...item }))

const selected = ref(['INV-2043'])

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function statusColor(status) {
  if (status === 'Paid') return 'success'
  if (status === 'Overdue') return 'danger'
  return 'warning'
}
</script>

<template>
  <div>
    <f-data-table
      v-model="selected"
      show-select
      select-strategy="all"
      item-selectable="payable"
      :headers="headers"
      :items="items"
      :items-per-page="5"
    >
      <template #item.status="{ value }">
        <f-chip size="small" :color="statusColor(value)">{{ value }}</f-chip>
      </template>
      <template #item.amount="{ value }">{{ money.format(value) }}</template>
    </f-data-table>

    <div class="bar">
      <span>{{ selected.length }} selected</span>
      <f-btn size="small" color="primary" :disabled="!selected.length">Send reminder</f-btn>
    </div>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  font-size: 0.875rem;
}
</style>
