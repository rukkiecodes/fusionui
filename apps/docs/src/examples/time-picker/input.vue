<script setup lang="ts">
import { ref } from 'vue'

const reminder = ref<string | null>('08:15')
</script>

<template>
  <div class="w">
    <f-time-input
      v-model="reminder"
      label="Daily reminder"
      prepend-icon="bell"
      hint="Type 8:15, or open the picker"
      persistent-hint
      clearable
    />
    <code>{{ reminder ?? 'null' }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 300px;
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
