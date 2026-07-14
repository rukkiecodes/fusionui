<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Department', key: 'department' },
  { title: 'Location', key: 'location' },
]

const items = [
  {
    id: 1,
    name: 'Lana Steiner',
    email: 'lana@northwind.io',
    department: 'Engineering',
    location: 'Berlin',
  },
  {
    id: 2,
    name: 'Candice Wu',
    email: 'candice@northwind.io',
    department: 'Engineering',
    location: 'Toronto',
  },
  {
    id: 3,
    name: 'Demi Wilkinson',
    email: 'demi@northwind.io',
    department: 'Design',
    location: 'Lisbon',
  },
  {
    id: 4,
    name: 'Natali Craig',
    email: 'natali@northwind.io',
    department: 'Sales',
    location: 'Dublin',
  },
  {
    id: 5,
    name: 'Drew Cano',
    email: 'drew@northwind.io',
    department: 'Sales',
    location: 'Manchester',
  },
  {
    id: 6,
    name: 'Koray Okumus',
    email: 'koray@northwind.io',
    department: 'Support',
    location: 'Manchester',
  },
  {
    id: 7,
    name: 'Orlando Diggs',
    email: 'orlando@northwind.io',
    department: 'Engineering',
    location: 'Berlin',
  },
]

const search = ref('')
</script>

<template>
  <f-data-table
    :headers="headers"
    :items="items"
    :search="search"
    :filter-keys="['name', 'email']"
    :items-per-page="5"
  >
    <template #top>
      <div class="search">
        <f-input v-model="search" placeholder="Search people…" prepend-icon="search" clearable />
      </div>
    </template>

    <template #no-data>
      <f-empty-state
        icon="search"
        title="No people match your search"
        :text="`Nothing found for “${search}”. Try a name or an email address.`"
      />
    </template>
  </f-data-table>
</template>

<style scoped>
.search {
  max-width: 280px;
}
</style>
