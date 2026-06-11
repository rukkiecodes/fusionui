<script setup>
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Score', key: 'score', sortable: true, align: 'end' },
]
const items = [
  { name: 'Ada Lovelace', role: 'Engineer', score: 98 },
  { name: 'Alan Turing', role: 'Researcher', score: 95 },
  { name: 'Grace Hopper', role: 'Admiral', score: 99 },
]
</script>

<template>
  <vd-table :headers="headers" :items="items" striped>
    <template #item.score="{ value }">
      <vd-chip size="small" :color="value > 96 ? 'success' : 'warning'">{{ value }}</vd-chip>
    </template>
  </vd-table>
</template>
