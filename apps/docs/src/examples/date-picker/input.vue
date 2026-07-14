<script setup lang="ts">
import { ref } from 'vue'

const invoiceDate = ref<Date | null>(null)
</script>

<template>
  <div class="w">
    <f-date-input
      v-model="invoiceDate"
      label="Invoice date"
      hint="Type it, or open the calendar"
      persistent-hint
      clearable
      block
    />
    <code>{{ invoiceDate ? invoiceDate.toDateString() : 'null' }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
