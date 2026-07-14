<script setup>
const products = [
  { id: 1, name: 'Mechanical keyboard', category: 'Peripherals', price: 149, stock: 32 },
  { id: 2, name: 'Wireless mouse', category: 'Peripherals', price: 64, stock: 8 },
  { id: 3, name: '27" display', category: 'Displays', price: 429, stock: 12 },
  { id: 4, name: 'Monitor arm', category: 'Furniture', price: 83, stock: 0 },
  { id: 5, name: 'Desk mat, walnut', category: 'Furniture', price: 45, stock: 54 },
  { id: 6, name: 'USB-C dock', category: 'Peripherals', price: 189, stock: 3 },
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <f-data-iterator :items="products" :items-per-page="6" class="iterator">
    <template #default="{ items }">
      <div class="grid">
        <f-card v-for="product in items" :key="product.id">
          <f-card-title>
            <h4>{{ product.name }}</h4>
          </f-card-title>
          <f-card-text>
            <p class="meta">
              <f-chip size="small">{{ product.category }}</f-chip>
              <strong>{{ money.format(product.price) }}</strong>
            </p>
            <p class="stock" :class="{ 'stock--out': !product.stock }">
              {{ product.stock ? `${product.stock} in stock` : 'Out of stock' }}
            </p>
          </f-card-text>
        </f-card>
      </div>
    </template>
  </f-data-iterator>
</template>

<style scoped>
.iterator {
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  text-align: start;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 0 6px;
}

.stock {
  margin: 0;
  font-size: 0.8125rem;
  opacity: 0.65;
}

.stock--out {
  color: rgb(var(--fui-theme-danger));
  opacity: 1;
}
</style>
