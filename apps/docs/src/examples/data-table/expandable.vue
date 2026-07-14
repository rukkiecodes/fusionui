<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Order', key: 'number' },
  { title: 'Customer', key: 'customer' },
  { title: 'Placed', key: 'placed' },
  { title: 'Total', key: 'total', align: 'end' },
]

const items = [
  {
    id: 4021,
    number: '#4021',
    customer: 'Northwind Ltd',
    placed: '2026-07-02',
    total: 268,
    shipTo: '14 Rosemount Ave, Dublin',
    lines: [
      { sku: 'KB-113', name: 'Mechanical keyboard', qty: 1, price: 149 },
      { sku: 'CB-002', name: 'USB-C cable, 2 m', qty: 3, price: 12 },
      { sku: 'MP-041', name: 'Desk mat, walnut', qty: 1, price: 83 },
    ],
  },
  {
    id: 4022,
    number: '#4022',
    customer: 'Bluebird Co',
    placed: '2026-07-03',
    total: 94,
    shipTo: '2 Kestrel Row, Manchester',
    lines: [
      { sku: 'MS-220', name: 'Wireless mouse', qty: 1, price: 64 },
      { sku: 'CB-002', name: 'USB-C cable, 2 m', qty: 1, price: 12 },
      { sku: 'ST-009', name: 'Laptop stand', qty: 1, price: 18 },
    ],
  },
  {
    id: 4023,
    number: '#4023',
    customer: 'Halcyon Media',
    placed: '2026-07-05',
    total: 512,
    shipTo: '77 Alder Street, Lisbon',
    lines: [
      { sku: 'MN-401', name: '27" display', qty: 1, price: 429 },
      { sku: 'AR-018', name: 'Monitor arm', qty: 1, price: 83 },
    ],
  },
]

const expanded = ref([4021])

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <f-data-table
    v-model:expanded="expanded"
    show-expand
    expand-on-click
    :headers="headers"
    :items="items"
    hide-default-footer
  >
    <template #item.total="{ value }">{{ money.format(value) }}</template>

    <template #expanded-row="{ item }">
      <div class="detail">
        <p class="detail__ship">Ships to {{ item.shipTo }}</p>
        <table class="lines">
          <tr v-for="line in item.lines" :key="line.sku">
            <td class="lines__sku">{{ line.sku }}</td>
            <td>{{ line.name }}</td>
            <td class="lines__qty">× {{ line.qty }}</td>
            <td class="lines__price">{{ money.format(line.price * line.qty) }}</td>
          </tr>
        </table>
      </div>
    </template>
  </f-data-table>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.875rem;
}

.detail__ship {
  margin: 0;
  opacity: 0.7;
}

.lines {
  width: 100%;
  border-collapse: collapse;
}

.lines td {
  padding: 4px 0;
}

.lines__sku {
  width: 84px;
  font-family: var(--fui-font-mono, monospace);
  opacity: 0.6;
}

.lines__qty {
  width: 60px;
  text-align: end;
  opacity: 0.7;
}

.lines__price {
  width: 96px;
  text-align: end;
  font-variant-numeric: tabular-nums;
}
</style>
