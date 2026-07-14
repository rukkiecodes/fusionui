<script setup>
import { ref } from 'vue'

const customers = [
  'Northwind Ltd',
  'Bluebird Co',
  'Halcyon Media',
  'Aster Health',
  'Foxglove Studio',
]

const invoices = Array.from({ length: 2000 }, (_, i) => ({
  id: 3000 + i,
  number: `INV-${3000 + i}`,
  customer: customers[i % customers.length],
  amount: 120 + ((i * 173) % 9800),
}))

const list = ref(null)
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Exposed by the component: jump straight to a row, measured or not.
function jumpTo(index) {
  list.value?.scrollToIndex(index)
}
</script>

<template>
  <div>
    <div class="jumps">
      <f-btn size="small" variant="outlined" @click="jumpTo(0)">Top</f-btn>
      <f-btn size="small" variant="outlined" @click="jumpTo(999)">INV-3999</f-btn>
      <f-btn size="small" variant="outlined" @click="jumpTo(invoices.length - 1)">Last</f-btn>
    </div>

    <div class="w">
      <f-virtual-scroll ref="list" :items="invoices" :item-height="44" item-key="id" height="260">
        <template #default="{ item }">
          <div class="row">
            <code>{{ item.number }}</code>
            <span>{{ item.customer }}</span>
            <span class="row__amount">{{ money.format(item.amount) }}</span>
          </div>
        </template>
      </f-virtual-scroll>
    </div>
  </div>
</template>

<style scoped>
.jumps {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 14px;
}

.w {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  border-radius: var(--fui-radius-md);
}

.row {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 14px;
  font-size: 0.875rem;
  text-align: start;
}

.row__amount {
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
</style>
