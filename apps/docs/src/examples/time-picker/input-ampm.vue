<script setup lang="ts">
import { ref } from 'vue'

const pickup = ref<string | null>(null)
</script>

<template>
  <div class="w">
    <f-time-input
      v-model="pickup"
      format="ampm"
      min="08:00"
      max="18:00"
      scrollable
      color="success"
      label="Pickup time"
      picker-title="Collection window"
      location="top"
    />
    <code>{{ pickup ?? 'null' }}</code>
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
