<script setup>
const headers = [
  { title: 'Service', key: 'name' },
  { title: 'Region', key: 'region' },
  { title: 'Uptime', key: 'uptime', align: 'end' },
  { title: 'Status', key: 'status', align: 'center' },
]

const items = [
  { id: 1, name: 'api-gateway', region: 'eu-west-1', uptime: 99.98, status: 'healthy' },
  { id: 2, name: 'billing-worker', region: 'us-east-1', uptime: 99.4, status: 'degraded' },
  { id: 3, name: 'image-resizer', region: 'eu-west-1', uptime: 87.1, status: 'down' },
]

const color = status =>
  status === 'healthy' ? 'success' : status === 'degraded' ? 'warning' : 'danger'
</script>

<template>
  <f-data-table :headers="headers" :items="items" hide-default-footer>
    <!-- header.<key> — the scope carries the column and the sort state. -->
    <template #header.uptime="{ column, isSorted, sortOrder }">
      <span class="head">
        {{ column.title }}
        <f-icon
          v-if="isSorted"
          :icon="sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'"
          size="x-small"
        />
      </span>
    </template>

    <!-- item.<key> — the scope carries the raw item, the resolved cell value and the row index. -->
    <template #item.name="{ item }">
      <code>{{ item.name }}</code>
    </template>

    <template #item.uptime="{ value }">
      <span class="uptime">{{ value.toFixed(2) }}%</span>
    </template>

    <template #item.status="{ value }">
      <f-chip size="small" :color="color(value)">{{ value }}</f-chip>
    </template>
  </f-data-table>
</template>

<style scoped>
.head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.uptime {
  font-variant-numeric: tabular-nums;
}
code {
  font-family: var(--fui-font-family-mono, monospace);
  font-size: 0.85em;
}
</style>
