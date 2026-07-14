<script setup lang="ts">
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Role', key: 'role' },
  { title: 'Location', key: 'location' },
]

const items = [
  { name: 'Amara Okafor', role: 'Design lead', location: 'Lagos' },
  { name: 'Jonas Weber', role: 'Frontend engineer', location: 'Berlin' },
  { name: 'Priya Nair', role: 'Product manager', location: 'Bangalore' },
  { name: 'Lucas Ferreira', role: 'Support engineer', location: 'São Paulo' },
]
</script>

<template>
  <f-table :headers="headers" :items="items" />
</template>
