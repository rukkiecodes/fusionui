<script setup>
import { ref } from 'vue'

const items = [
  {
    value: 'engineering',
    title: 'Engineering',
    children: [
      { value: 'lana', title: 'Lana Steiner' },
      { value: 'candice', title: 'Candice Wu' },
      { value: 'orlando', title: 'Orlando Diggs' },
    ],
  },
  {
    value: 'design',
    title: 'Design',
    children: [
      { value: 'demi', title: 'Demi Wilkinson' },
      { value: 'kate', title: 'Kate Morrison' },
    ],
  },
  {
    value: 'sales',
    title: 'Sales',
    children: [
      { value: 'natali', title: 'Natali Craig' },
      { value: 'drew', title: 'Drew Cano' },
      { value: 'andi', title: 'Andi Lane' },
    ],
  },
]

const search = ref('')
</script>

<template>
  <div class="w">
    <f-input v-model="search" placeholder="Filter people…" prepend-icon="search" clearable />
    <f-treeview :items="items" :search="search" class="tree" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: start;
}

.tree {
  margin-top: 12px;
}
</style>
