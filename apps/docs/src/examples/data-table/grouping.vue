<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Department', key: 'department' },
  { title: 'Location', key: 'location' },
  { title: 'Level', key: 'level', align: 'end' },
]

const items = [
  { id: 1, name: 'Lana Steiner', department: 'Engineering', location: 'Berlin', level: 5 },
  { id: 2, name: 'Candice Wu', department: 'Engineering', location: 'Toronto', level: 6 },
  { id: 3, name: 'Orlando Diggs', department: 'Engineering', location: 'Berlin', level: 4 },
  { id: 4, name: 'Phoenix Baker', department: 'Engineering', location: 'Toronto', level: 3 },
  { id: 5, name: 'Demi Wilkinson', department: 'Design', location: 'Lisbon', level: 5 },
  { id: 6, name: 'Kate Morrison', department: 'Design', location: 'Lisbon', level: 3 },
  { id: 7, name: 'Natali Craig', department: 'Sales', location: 'Dublin', level: 4 },
  { id: 8, name: 'Drew Cano', department: 'Sales', location: 'Dublin', level: 6 },
  { id: 9, name: 'Andi Lane', department: 'Sales', location: 'Manchester', level: 2 },
  { id: 10, name: 'Koray Okumus', department: 'Support', location: 'Manchester', level: 3 },
]

// Two levels: department, then location inside it.
const groupBy = ref([{ key: 'department' }, { key: 'location' }])
</script>

<template>
  <f-data-table
    v-model:group-by="groupBy"
    open-all
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    hide-default-footer
  />
</template>
