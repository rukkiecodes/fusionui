<script setup lang="ts">
const items = [
  { title: 'Team', href: '#' },
  { title: 'Engineering', href: '#' },
  { title: 'Ada Lovelace' },
]
</script>

<template>
  <div class="stack">
    <f-breadcrumb :items="items" divider="chevrons-right" />
    <f-breadcrumb :items="items" divider="arrow-right" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
