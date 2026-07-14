<script setup lang="ts">
import { ref } from 'vue'

// The draft is a deep clone, so an object model works exactly like a string one:
// Cancel restores every field at once.
const notifications = ref({
  product: true,
  weekly: false,
  security: true,
})
</script>

<template>
  <div class="w">
    <f-confirm-edit v-model="notifications" hide-actions>
      <template #default="{ model, save, cancel, isPristine }">
        <f-switch v-model="model.value.product">Product updates</f-switch>
        <f-switch v-model="model.value.weekly">Weekly digest</f-switch>
        <f-switch v-model="model.value.security">Security alerts</f-switch>

        <div class="row">
          <f-btn variant="text" :disabled="isPristine" @click="cancel">Reset</f-btn>
          <f-btn color="primary" :disabled="isPristine" @click="save">Apply</f-btn>
        </div>
      </template>
    </f-confirm-edit>

    <code>{{ notifications }}</code>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}
</style>
