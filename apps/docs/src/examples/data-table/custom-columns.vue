<script setup>
const headers = [
  { title: 'Customer', key: 'customer' },
  { title: 'Plan', key: 'plan' },
  { title: 'Status', key: 'status', align: 'center' },
  // `value` resolves the cell from somewhere other than `key`.
  { title: 'Owner', key: 'owner', value: item => item.owner.name },
  { title: 'MRR', key: 'mrr', align: 'end' },
  { title: '', key: 'actions', sortable: false, align: 'end', width: 64 },
]

const items = [
  {
    id: 1,
    customer: 'Northwind Ltd',
    plan: 'Enterprise',
    status: 'Active',
    mrr: 4200,
    avatar: 12,
    owner: { name: 'Lana Steiner' },
  },
  {
    id: 2,
    customer: 'Bluebird Co',
    plan: 'Team',
    status: 'Trial',
    mrr: 890,
    avatar: 32,
    owner: { name: 'Drew Cano' },
  },
  {
    id: 3,
    customer: 'Halcyon Media',
    plan: 'Starter',
    status: 'Churned',
    mrr: 0,
    avatar: 45,
    owner: { name: 'Natali Craig' },
  },
  {
    id: 4,
    customer: 'Ridgeline Coffee',
    plan: 'Team',
    status: 'Active',
    mrr: 1580,
    avatar: 8,
    owner: { name: 'Candice Wu' },
  },
]

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function statusColor(status) {
  if (status === 'Active') return 'success'
  if (status === 'Trial') return 'warning'
  return 'danger'
}
</script>

<template>
  <f-data-table :headers="headers" :items="items" hide-default-footer>
    <!-- header.<key> replaces a single column heading — the cell stays sortable. -->
    <template #header.mrr="{ column, isSorted, sortOrder }">
      <span class="mrr-head">
        <f-icon
          v-if="isSorted"
          :icon="sortOrder === 'desc' ? 'trending-down' : 'trending-up'"
          size="x-small"
        />
        {{ column.title }}
      </span>
    </template>

    <!-- item.<key> takes over a single cell. -->
    <template #item.customer="{ item }">
      <div class="cell-customer">
        <f-avatar circle size="x-small" :image="`https://i.pravatar.cc/80?img=${item.avatar}`" />
        <span>{{ item.customer }}</span>
      </div>
    </template>

    <template #item.status="{ value }">
      <f-chip size="small" :color="statusColor(value)">{{ value }}</f-chip>
    </template>

    <template #item.mrr="{ value }">
      <span class="mrr">{{ value ? money.format(value) : '—' }}</span>
    </template>

    <template #item.actions>
      <f-btn icon="more-horizontal" variant="text" size="small" />
    </template>
  </f-data-table>
</template>

<style scoped>
.cell-customer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mrr-head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.mrr {
  font-variant-numeric: tabular-nums;
}
</style>
