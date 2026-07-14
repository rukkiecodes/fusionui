<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Order', key: 'number' },
  { title: 'Customer', key: 'customer' },
  { title: 'Placed', key: 'placed' },
  { title: 'Items', key: 'items', align: 'center' },
  { title: 'Total', key: 'total', align: 'end' },
]

const customers = [
  'Northwind Ltd',
  'Bluebird Co',
  'Halcyon Media',
  'Ridgeline Coffee',
  'Aster Health',
  'Kestrel Logistics',
  'Meridian Books',
  'Foxglove Studio',
]

// 84 orders — enough to make the pager do real work.
const items = Array.from({ length: 84 }, (_, i) => ({
  id: i + 1,
  number: `#${4000 + i}`,
  customer: customers[i % customers.length],
  placed: new Date(2026, 0, 1 + i).toISOString().slice(0, 10),
  items: (i % 6) + 1,
  total: 40 + ((i * 37) % 460),
}))

const page = ref(1)
const itemsPerPage = ref(5)

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <div>
    <f-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :items-per-page-options="[5, 10, 25, -1]"
      page-text="Showing {0}–{1} of {2} orders"
    >
      <template #item.total="{ value }">{{ money.format(value) }}</template>
    </f-data-table>

    <p class="state">Page {{ page }}, {{ itemsPerPage }} rows per page.</p>
  </div>
</template>

<style scoped>
.state {
  margin-top: 14px;
  font-size: 0.875rem;
  opacity: 0.7;
}
</style>
