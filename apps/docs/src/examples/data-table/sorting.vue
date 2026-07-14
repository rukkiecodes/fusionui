<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Employee', key: 'name' },
  { title: 'Department', key: 'department' },
  { title: 'Level', key: 'level', align: 'center' },
  // A column that should never be sorted.
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Salary', key: 'salary', align: 'end' },
]

const items = [
  {
    id: 1,
    name: 'Lana Steiner',
    department: 'Engineering',
    level: 5,
    email: 'lana@northwind.io',
    salary: 128000,
  },
  {
    id: 2,
    name: 'Candice Wu',
    department: 'Engineering',
    level: 6,
    email: 'candice@northwind.io',
    salary: 146000,
  },
  {
    id: 3,
    name: 'Orlando Diggs',
    department: 'Engineering',
    level: 4,
    email: 'orlando@northwind.io',
    salary: 104000,
  },
  {
    id: 4,
    name: 'Demi Wilkinson',
    department: 'Design',
    level: 5,
    email: 'demi@northwind.io',
    salary: 118000,
  },
  {
    id: 5,
    name: 'Kate Morrison',
    department: 'Design',
    level: 3,
    email: 'kate@northwind.io',
    salary: 92000,
  },
  {
    id: 6,
    name: 'Natali Craig',
    department: 'Sales',
    level: 4,
    email: 'natali@northwind.io',
    salary: 99000,
  },
  {
    id: 7,
    name: 'Drew Cano',
    department: 'Sales',
    level: 6,
    email: 'drew@northwind.io',
    salary: 137000,
  },
]

// Starts sorted by department, then by salary (highest first) inside each one.
const sortBy = ref([
  { key: 'department', order: 'asc' },
  { key: 'salary', order: 'desc' },
])

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
</script>

<template>
  <div>
    <f-data-table
      v-model:sort-by="sortBy"
      multi-sort
      must-sort
      :headers="headers"
      :items="items"
      :items-per-page="10"
      hide-default-footer
    >
      <template #item.salary="{ value }">{{ money.format(value) }}</template>
    </f-data-table>

    <p class="state">
      <code>sortBy</code>:
      <f-chip v-for="s in sortBy" :key="s.key" size="small" color="primary">
        {{ s.key }} · {{ s.order }}
      </f-chip>
    </p>
  </div>
</template>

<style scoped>
.state {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 0.875rem;
}
</style>
