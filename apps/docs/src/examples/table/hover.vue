<script setup lang="ts">
const headers = [
  { title: 'Metric', key: 'metric' },
  { title: 'This week', key: 'current', align: 'end' as const },
  { title: 'Last week', key: 'previous', align: 'end' as const },
]

const items = [
  { metric: 'Sign-ups', current: '1,024', previous: '958' },
  { metric: 'Active projects', current: '312', previous: '298' },
  { metric: 'Churned accounts', current: '7', previous: '11' },
]
</script>

<template>
  <f-table :hover="false" :headers="headers" :items="items" />
</template>
