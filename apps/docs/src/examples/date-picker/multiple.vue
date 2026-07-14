<script setup lang="ts">
import { ref } from 'vue'

const dates = ref<Date[]>([])
</script>

<template>
  <div class="w">
    <f-date-picker v-model="dates" multiple color="success" title="Pick your shifts" />
    <code>{{ dates.length ? dates.map(d => d.toDateString()).join(' · ') : 'No shifts yet' }}</code>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
code {
  width: 100%;
  max-width: 420px;
  text-align: center;
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}
</style>
