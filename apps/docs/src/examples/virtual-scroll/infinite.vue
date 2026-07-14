<script setup>
import { ref } from 'vue'

const customers = [
  'Northwind Ltd',
  'Bluebird Co',
  'Halcyon Media',
  'Aster Health',
  'Foxglove Studio',
]

function makeOrders(from, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: from + i,
    number: `#${4000 + from + i}`,
    customer: customers[(from + i) % customers.length],
    total: 40 + (((from + i) * 37) % 460),
  }))
}

const TOTAL = 60
const orders = ref(makeOrders(0, 15))
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// `done` is what unlatches the next request: 'ok' to keep going, 'empty' when
// the list is exhausted, 'error' to show the retry affordance.
function load({ done }) {
  setTimeout(() => {
    if (orders.value.length >= TOTAL) {
      done('empty')
      return
    }
    orders.value.push(...makeOrders(orders.value.length, 15))
    done('ok')
  }, 900)
}
</script>

<template>
  <div class="w">
    <f-infinite-scroll height="320" @load="load">
      <div v-for="order in orders" :key="order.id" class="row">
        <strong>{{ order.number }}</strong>
        <span>{{ order.customer }}</span>
        <span class="row__total">{{ money.format(order.total) }}</span>
      </div>
    </f-infinite-scroll>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  border-radius: var(--fui-radius-md);
}

.row {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
  font-size: 0.875rem;
  text-align: start;
}

.row__total {
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}
</style>
