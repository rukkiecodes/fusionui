<script setup>
import { ref } from 'vue'

const items = [
  {
    value: 'reports',
    title: 'Reports',
    children: [
      {
        value: 'reports/2026',
        title: '2026',
        children: [
          { value: 'reports/2026/q1.pdf', title: 'Q1 revenue.pdf' },
          { value: 'reports/2026/q2.pdf', title: 'Q2 revenue.pdf' },
        ],
      },
      {
        value: 'reports/2025',
        title: '2025',
        children: [
          { value: 'reports/2025/annual.pdf', title: 'Annual report.pdf' },
          { value: 'reports/2025/audit.pdf', title: 'Audit.pdf', disabled: true },
        ],
      },
    ],
  },
  {
    value: 'contracts',
    title: 'Contracts',
    children: [
      { value: 'contracts/northwind.pdf', title: 'Northwind Ltd.pdf' },
      { value: 'contracts/bluebird.pdf', title: 'Bluebird Co.pdf' },
    ],
  },
]

// Only leaves ever land in the model — branches are derived from them.
const selected = ref(['reports/2026/q1.pdf'])
</script>

<template>
  <div class="w">
    <f-treeview
      v-model:selected="selected"
      selectable
      select-strategy="classic"
      open-all
      :items="items"
    />
    <p class="state">{{ selected.length }} file(s) selected</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: start;
}

.state {
  margin-top: 12px;
  font-size: 0.8125rem;
  opacity: 0.7;
}
</style>
