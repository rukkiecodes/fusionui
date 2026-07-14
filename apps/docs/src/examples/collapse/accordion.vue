<script setup lang="ts">
import { ref } from 'vue'

const sections = [
  {
    id: 'shipping',
    title: 'Shipping',
    text: 'Free above $50, otherwise a flat $4.90. Orders placed before 2pm ship the same day.',
  },
  {
    id: 'returns',
    title: 'Returns',
    text: 'Send anything back within 30 days, unworn and with the tags on, for a full refund.',
  },
  {
    id: 'warranty',
    title: 'Warranty',
    text: 'Two years against manufacturing defects, extended to five if you register online.',
  },
]

const open = ref('shipping')

function toggle(id: string, value: boolean) {
  open.value = value ? id : ''
}
</script>

<template>
  <div class="stack">
    <f-collapse
      v-for="section in sections"
      :key="section.id"
      :title="section.title"
      :model-value="open === section.id"
      @update:model-value="toggle(section.id, $event)"
    >
      <p>{{ section.text }}</p>
    </f-collapse>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
