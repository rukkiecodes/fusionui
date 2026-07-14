<script setup>
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Role', key: 'role' },
  { title: 'Department', key: 'department' },
  { title: 'Location', key: 'location' },
  { title: 'Started', key: 'started', align: 'end' },
]

const items = [
  {
    id: 1,
    name: 'Lana Steiner',
    role: 'Staff engineer',
    department: 'Engineering',
    location: 'Berlin',
    started: '2019-03-04',
  },
  {
    id: 2,
    name: 'Demi Wilkinson',
    role: 'Product designer',
    department: 'Design',
    location: 'Lisbon',
    started: '2021-06-14',
  },
  {
    id: 3,
    name: 'Candice Wu',
    role: 'Engineering manager',
    department: 'Engineering',
    location: 'Toronto',
    started: '2018-11-02',
  },
  {
    id: 4,
    name: 'Natali Craig',
    role: 'Account executive',
    department: 'Sales',
    location: 'Dublin',
    started: '2022-01-10',
  },
  {
    id: 5,
    name: 'Drew Cano',
    role: 'Support lead',
    department: 'Support',
    location: 'Manchester',
    started: '2020-09-21',
  },
]
</script>

<template>
  <f-data-table :headers="headers" :items="items" :items-per-page="5" />
</template>
