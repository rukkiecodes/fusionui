<script setup>
import { ref } from 'vue'

const products = [
  { id: 1, name: 'Mechanical keyboard', category: 'Peripherals', price: 149 },
  { id: 2, name: 'Wireless mouse', category: 'Peripherals', price: 64 },
  { id: 3, name: '27" display', category: 'Displays', price: 429 },
  { id: 4, name: 'Ultrawide display', category: 'Displays', price: 749 },
  { id: 5, name: 'Monitor arm', category: 'Furniture', price: 83 },
  { id: 6, name: 'Desk mat, walnut', category: 'Furniture', price: 45 },
  { id: 7, name: 'USB-C dock', category: 'Peripherals', price: 189 },
  { id: 8, name: 'Standing desk', category: 'Furniture', price: 690 },
]

const search = ref('')
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <f-data-iterator
    :items="products"
    :search="search"
    :filter-keys="['name', 'category']"
    :items-per-page="4"
  >
    <template #header>
      <div class="search">
        <f-input v-model="search" placeholder="Search products…" prepend-icon="search" clearable />
      </div>
    </template>

    <template #default="{ items }">
      <ul class="results">
        <li v-for="product in items" :key="product.id">
          <span>{{ product.name }}</span>
          <span class="results__meta">
            {{ product.category }} · {{ money.format(product.price) }}
          </span>
        </li>
      </ul>
    </template>

    <template #no-data>
      <f-empty-state
        icon="search"
        title="Nothing matched"
        text="Try a product name or a category."
      />
    </template>
  </f-data-iterator>
</template>

<style scoped>
.search {
  width: 100%;
  max-width: 280px;
  margin-bottom: 16px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: start;
}

.results li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--fui-radius-md);
  background: rgba(var(--fui-theme-on-surface), 0.04);
}

.results__meta {
  font-size: 0.8125rem;
  opacity: 0.65;
}
</style>
