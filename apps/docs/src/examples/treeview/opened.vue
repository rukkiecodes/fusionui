<script setup>
import { ref } from 'vue'

const items = [
  {
    value: 'engineering',
    title: 'Engineering',
    children: [
      {
        value: 'platform',
        title: 'Platform',
        children: [{ value: 'lana', title: 'Lana Steiner' }],
      },
      { value: 'mobile', title: 'Mobile', children: [{ value: 'candice', title: 'Candice Wu' }] },
    ],
  },
  {
    value: 'design',
    title: 'Design',
    children: [
      { value: 'brand', title: 'Brand', children: [{ value: 'demi', title: 'Demi Wilkinson' }] },
      {
        value: 'product-design',
        title: 'Product',
        children: [{ value: 'kate', title: 'Kate Morrison' }],
      },
    ],
  },
  {
    value: 'sales',
    title: 'Sales',
    children: [
      { value: 'emea', title: 'EMEA', children: [{ value: 'natali', title: 'Natali Craig' }] },
      { value: 'amer', title: 'Americas', children: [{ value: 'drew', title: 'Drew Cano' }] },
    ],
  },
]

const opened = ref(['engineering'])
</script>

<template>
  <div class="w">
    <!-- `single` is the accordion: opening a branch closes its siblings. -->
    <f-treeview v-model:opened="opened" :items="items" open-strategy="single" />
    <p class="state">opened: {{ opened.join(', ') || '—' }}</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: start;
}

.state {
  margin-top: 12px;
  font-size: 0.8125rem;
  opacity: 0.7;
}
</style>
