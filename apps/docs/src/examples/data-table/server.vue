<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Invoice', key: 'number' },
  { title: 'Customer', key: 'customer' },
  { title: 'Issued', key: 'issued' },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Amount', key: 'amount', align: 'end' },
]

// ---- stands in for the database -------------------------------------------
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
const statuses = ['Paid', 'Open', 'Overdue']

const database = Array.from({ length: 213 }, (_, i) => ({
  id: 3000 + i,
  number: `INV-${3000 + i}`,
  customer: customers[(i * 3) % customers.length],
  issued: new Date(2026, 0, 1 + i).toISOString().slice(0, 10),
  status: statuses[i % statuses.length],
  amount: 120 + ((i * 173) % 9800),
}))

/** Pretend network call: filters, sorts and slices on the "server". */
function fetchInvoices({ page, itemsPerPage, sortBy, search }) {
  return new Promise(resolve => {
    setTimeout(() => {
      let rows = database

      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter(
          row => row.customer.toLowerCase().includes(q) || row.number.toLowerCase().includes(q)
        )
      }

      if (sortBy.length) {
        const { key, order } = sortBy[0]
        rows = [...rows].sort((a, b) => {
          const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
          return order === 'desc' ? -result : result
        })
      }

      const total = rows.length
      const start = (page - 1) * itemsPerPage
      const items = itemsPerPage === -1 ? rows : rows.slice(start, start + itemsPerPage)
      resolve({ items, total })
    }, 500)
  })
}

// ---- wiring ----------------------------------------------------------------
const serverItems = ref([])
const itemsLength = ref(0)
const loading = ref(false)
const search = ref('')

// The table fires `update:options` on mount and on every page / sort / search
// change, so this one handler drives every fetch. `request` drops the answer to
// a query the user has already moved on from.
let request = 0

async function load(options) {
  const ticket = ++request
  loading.value = true
  const { items, total } = await fetchInvoices(options)
  if (ticket !== request) return
  serverItems.value = items
  itemsLength.value = total
  loading.value = false
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function statusColor(status) {
  if (status === 'Paid') return 'success'
  if (status === 'Overdue') return 'danger'
  return 'warning'
}
</script>

<template>
  <f-data-table-server
    :headers="headers"
    :items="serverItems"
    :items-length="itemsLength"
    :loading="loading"
    :search="search"
    :items-per-page="10"
    @update:options="load"
  >
    <template #top>
      <div class="search">
        <f-input v-model="search" placeholder="Search invoices…" prepend-icon="search" clearable />
      </div>
    </template>

    <template #item.status="{ value }">
      <f-chip size="small" :color="statusColor(value)">{{ value }}</f-chip>
    </template>

    <template #item.amount="{ value }">{{ money.format(value) }}</template>
  </f-data-table-server>
</template>

<style scoped>
.search {
  max-width: 280px;
}
</style>
