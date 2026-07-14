<script setup>
import { ref } from 'vue'

const orders = [
  { id: 1, number: '#4021', customer: 'Northwind Ltd', placed: '2026-07-02', total: 268 },
  { id: 2, number: '#4022', customer: 'Bluebird Co', placed: '2026-07-03', total: 94 },
  { id: 3, number: '#4023', customer: 'Halcyon Media', placed: '2026-07-05', total: 512 },
  { id: 4, number: '#4024', customer: 'Aster Health', placed: '2026-07-06', total: 1340 },
  { id: 5, number: '#4025', customer: 'Ridgeline Coffee', placed: '2026-07-08', total: 76 },
  { id: 6, number: '#4026', customer: 'Kestrel Logistics', placed: '2026-07-09', total: 405 },
]

const sortBy = ref([{ key: 'total', order: 'desc' }])

const columns = [
  { key: 'customer', label: 'Customer' },
  { key: 'placed', label: 'Placed' },
  { key: 'total', label: 'Total' },
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <f-data-iterator v-model:sort-by="sortBy" :items="orders" :items-per-page="6">
    <!-- `toggleSort` cycles asc → desc → unsorted; `sortOrder` reports the state. -->
    <template #header="{ sortOrder, toggleSort }">
      <div class="sorters">
        <f-btn
          v-for="column in columns"
          :key="column.key"
          size="small"
          color="primary"
          :variant="sortOrder(column.key) ? 'flat' : 'outlined'"
          :append-icon="sortOrder(column.key) === 'desc' ? 'arrow-down' : 'arrow-up'"
          @click="toggleSort(column.key)"
        >
          {{ column.label }}
        </f-btn>
      </div>
    </template>

    <template #default="{ items }">
      <ul class="rows">
        <li v-for="order in items" :key="order.id">
          <strong>{{ order.number }}</strong>
          <span>{{ order.customer }}</span>
          <span class="rows__date">{{ order.placed }}</span>
          <span class="rows__total">{{ money.format(order.total) }}</span>
        </li>
      </ul>
    </template>
  </f-data-iterator>
</template>

<style scoped>
.sorters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: start;
}

.rows li {
  display: grid;
  grid-template-columns: 70px 1fr auto auto;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-radius: var(--fui-radius-md);
  background: rgba(var(--fui-theme-on-surface), 0.04);
}

.rows__date,
.rows__total {
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

.rows__date {
  opacity: 0.6;
}
</style>
