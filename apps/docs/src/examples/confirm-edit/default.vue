<script setup lang="ts">
import { ref } from 'vue'

const displayName = ref('Ada Lovelace')
</script>

<template>
  <div class="w">
    <f-confirm-edit v-model="displayName">
      <template #default="{ model }">
        <f-input v-model="model.value" label="Display name" block />
      </template>
    </f-confirm-edit>

    <code>{{ displayName }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
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
