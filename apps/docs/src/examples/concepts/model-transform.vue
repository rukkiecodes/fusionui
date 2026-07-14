<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'Run', key: 'run' },
  { title: 'Branch', key: 'branch' },
  { title: 'Duration', key: 'duration', align: 'end' },
]

const items = [
  { id: 'r-118', run: '#118', branch: 'main', duration: '2m 04s', log: 'All 412 tests passed.' },
  { id: 'r-117', run: '#117', branch: 'fix/menu', duration: '1m 58s', log: '2 tests failed.' },
  { id: 'r-116', run: '#116', branch: 'main', duration: '2m 11s', log: 'All 410 tests passed.' },
]

// Plain array in, plain array out — the table works with a Set internally.
const expanded = ref(['r-118'])
</script>

<template>
  <div class="wrap">
    <f-data-table
      v-model:expanded="expanded"
      show-expand
      expand-on-click
      :headers="headers"
      :items="items"
      item-value="id"
      hide-default-footer
    >
      <template #expanded-row="{ item }">
        <p class="log">{{ item.log }}</p>
      </template>
    </f-data-table>

    <div class="readout">
      <span
        >expanded: <code>{{ JSON.stringify(expanded) }}</code></span
      >
      <f-btn size="small" variant="outlined" @click="expanded = items.map(i => i.id)">
        Expand all
      </f-btn>
      <f-btn size="small" variant="text" @click="expanded = []">Collapse all</f-btn>
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
.log {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
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
