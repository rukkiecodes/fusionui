<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const result = ref('')

function decide(answer: string): void {
  result.value = answer
  open.value = false
}
</script>

<template>
  <div class="wrap">
    <f-btn color="danger" variant="tonal" @click="open = true">Delete workspace</f-btn>

    <f-bottom-sheet v-model="open" persistent not-handle>
      <h4 class="sheet__title">Delete “Marketing”?</h4>
      <p class="sheet__body">
        Every board, file and comment in this workspace will be removed. This cannot be undone.
      </p>

      <div class="sheet__actions">
        <f-btn variant="text" @click="decide('Cancelled')">Cancel</f-btn>
        <f-btn color="danger" @click="decide('Workspace deleted')">Delete</f-btn>
      </div>
    </f-bottom-sheet>

    <p v-if="result" class="hint">{{ result }}</p>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.sheet__title {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 600;
}
.sheet__body {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}
.sheet__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}
.hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
