<script setup lang="ts">
import { ref } from 'vue'

const stay = ref<Date[]>([])
</script>

<template>
  <div class="w">
    <f-date-picker
      v-model="stay"
      range
      show-adjacent-months
      title="Your stay"
      header="Check in — check out"
    />
    <code>
      {{ stay[0] ? stay[0].toDateString() : 'Check in' }} →
      {{ stay[1] ? stay[1].toDateString() : 'Check out' }}
    </code>
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
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}
</style>
