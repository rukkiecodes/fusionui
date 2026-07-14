<script setup lang="ts">
import { ref } from 'vue'
import type { FDatePickerView } from '@rukkiecodes/vue'

const date = ref<Date | null>(null)
const view = ref<FDatePickerView>('year')
</script>

<template>
  <div class="w">
    <div class="row">
      <f-btn size="small" variant="tonal" @click="view = 'month'">Days</f-btn>
      <f-btn size="small" variant="tonal" @click="view = 'months'">Months</f-btn>
      <f-btn size="small" variant="tonal" @click="view = 'year'">Years</f-btn>
    </div>

    <f-date-picker v-model="date" v-model:view="view" title="Date of birth" />

    <code>view: {{ view }}</code>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.row {
  display: flex;
  gap: 8px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
