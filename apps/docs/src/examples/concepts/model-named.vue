<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Package', key: 'name' },
  { title: 'Downloads', key: 'downloads', align: 'end' },
]

const items = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: `@rukkiecodes/pkg-${String(i + 1).padStart(2, '0')}`,
  downloads: (i * 137 + 42) * 11,
}))

// Each named model is an independent slice of the table's state.
const page = ref(1)
const itemsPerPage = ref(5)
const sortBy = ref([{ key: 'downloads', order: 'desc' }])
</script>

<template>
  <div class="wrap">
    <f-data-table
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="items"
      :items-per-page-options="[5, 10]"
    />

    <div class="readout">
      <span
        >page: <code>{{ page }}</code></span
      >
      <span
        >itemsPerPage: <code>{{ itemsPerPage }}</code></span
      >
      <span
        >sortBy: <code>{{ JSON.stringify(sortBy) }}</code></span
      >
      <f-btn size="small" variant="outlined" @click="page = 1">Reset page</f-btn>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.readout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  font-size: 0.85rem;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
  opacity: 0.8;
}
</style>
