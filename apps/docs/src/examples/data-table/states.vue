<script setup>
import { computed, ref } from 'vue'

const headers = [
  { title: 'Invoice', key: 'number' },
  { title: 'Customer', key: 'customer' },
  { title: 'Due', key: 'due' },
  { title: 'Amount', key: 'amount', align: 'end' },
]

const rows = [
  { id: 1, number: 'INV-2041', customer: 'Northwind Ltd', due: '2026-07-30', amount: '$4,200' },
  { id: 2, number: 'INV-2042', customer: 'Bluebird Co', due: '2026-08-02', amount: '$890' },
  { id: 3, number: 'INV-2043', customer: 'Halcyon Media', due: '2026-06-18', amount: '$12,400' },
]

const state = ref('loading')
const items = computed(() => (state.value === 'loaded' ? rows : []))
</script>

<template>
  <div>
    <div class="switcher">
      <f-btn
        v-for="s in ['loading', 'empty', 'loaded']"
        :key="s"
        size="small"
        :variant="state === s ? 'flat' : 'outlined'"
        color="primary"
        @click="state = s"
      >
        {{ s }}
      </f-btn>
    </div>

    <f-data-table
      :headers="headers"
      :items="items"
      :loading="state === 'loading'"
      loading-text="Fetching invoices…"
      hide-default-footer
    >
      <template #no-data>
        <f-empty-state
          icon="receipt"
          title="No invoices yet"
          text="Invoices appear here as soon as your first order ships."
        >
          <f-btn color="primary" prepend-icon="plus" size="small">New invoice</f-btn>
        </f-empty-state>
      </template>
    </f-data-table>
  </div>
</template>

<style scoped>
.switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
