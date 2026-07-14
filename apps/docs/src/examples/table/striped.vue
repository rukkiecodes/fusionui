<script setup lang="ts">
const headers = [
  { title: 'City', key: 'city' },
  { title: 'Country', key: 'country' },
  { title: 'Timezone', key: 'timezone' },
]

const items = [
  { city: 'Lisbon', country: 'Portugal', timezone: 'UTC+1' },
  { city: 'Nairobi', country: 'Kenya', timezone: 'UTC+3' },
  { city: 'Toronto', country: 'Canada', timezone: 'UTC−4' },
  { city: 'Osaka', country: 'Japan', timezone: 'UTC+9' },
  { city: 'Santiago', country: 'Chile', timezone: 'UTC−4' },
]
</script>

<template>
  <f-table striped :headers="headers" :items="items" />
</template>
