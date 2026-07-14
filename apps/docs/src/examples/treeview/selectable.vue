<script setup>
import { ref } from 'vue'

const items = [
  {
    value: 'billing',
    title: 'Billing',
    children: [
      { value: 'billing.read', title: 'View invoices' },
      { value: 'billing.write', title: 'Edit invoices' },
      { value: 'billing.refund', title: 'Issue refunds' },
    ],
  },
  {
    value: 'people',
    title: 'People',
    children: [
      { value: 'people.read', title: 'View directory' },
      { value: 'people.invite', title: 'Invite teammates' },
    ],
  },
]

const strategy = ref('leaf')
const selected = ref(['billing.read'])
</script>

<template>
  <div class="w">
    <div class="switcher">
      <f-btn
        v-for="s in ['leaf', 'independent']"
        :key="s"
        size="small"
        color="primary"
        :variant="strategy === s ? 'flat' : 'outlined'"
        @click="strategy = s"
      >
        {{ s }}
      </f-btn>
    </div>

    <f-treeview
      v-model:selected="selected"
      selectable
      :select-strategy="strategy"
      :items="items"
      :opened="['billing', 'people']"
    />

    <p class="state">selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: start;
}

.switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.state {
  margin-top: 12px;
  font-size: 0.8125rem;
  opacity: 0.7;
  word-break: break-word;
}
</style>
