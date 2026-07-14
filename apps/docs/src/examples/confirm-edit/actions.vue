<script setup lang="ts">
import { ref } from 'vue'

const bio = ref('Builds design systems. Occasionally sleeps.')
</script>

<template>
  <div class="w">
    <f-confirm-edit v-model="bio" color="success" ok-text="Save" cancel-text="Discard">
      <template #default="{ model, actions, isPristine }">
        <f-textarea v-model="model.value" label="Bio" :rows="3" />

        <div class="row">
          <span class="hint">{{ isPristine ? 'No changes' : 'Unsaved changes' }}</span>
          <!-- Placing `actions` yourself suppresses the default button row. -->
          <component :is="actions" />
        </div>
      </template>
    </f-confirm-edit>

    <code>{{ bio }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.hint {
  font-size: 0.82rem;
  opacity: 0.7;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
