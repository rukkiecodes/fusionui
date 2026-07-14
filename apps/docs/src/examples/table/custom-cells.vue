<script setup lang="ts">
const headers = [
  { title: 'Customer', key: 'customer' },
  { title: 'Plan', key: 'plan' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', align: 'end' as const },
]

const items = [
  { customer: 'Northwind Ltd', plan: 'Enterprise', status: 'Paid', avatar: 12 },
  { customer: 'Bluebird Co', plan: 'Team', status: 'Pending', avatar: 32 },
  { customer: 'Halcyon Media', plan: 'Starter', status: 'Overdue', avatar: 45 },
]

function statusColor(status: string) {
  if (status === 'Paid') return 'success'
  if (status === 'Pending') return 'warning'
  return 'danger'
}
</script>

<template>
  <f-table :headers="headers" :items="items">
    <template #item.customer="{ item }">
      <div class="cell-customer">
        <f-avatar circle size="x-small" :image="`https://i.pravatar.cc/80?img=${item.avatar}`" />
        <span>{{ item.customer }}</span>
      </div>
    </template>

    <template #item.status="{ item }">
      <f-chip size="small" :color="statusColor(item.status)">{{ item.status }}</f-chip>
    </template>

    <template #item.actions>
      <f-btn icon="more-horizontal" variant="text" size="small" />
    </template>
  </f-table>
</template>

<style scoped>
.cell-customer {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
