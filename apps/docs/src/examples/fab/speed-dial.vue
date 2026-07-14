<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const last = ref('')
</script>

<template>
  <div class="wrap">
    <f-speed-dial v-model="open" label="Create">
      <template #activator="{ props: activator, isActive }">
        <f-fab v-bind="activator" :icon="isActive ? 'x' : 'plus'" />
      </template>

      <f-btn
        icon="file-text"
        circle
        size="small"
        color="primary"
        aria-label="New document"
        @click="last = 'New document'"
      />
      <f-btn
        icon="image"
        circle
        size="small"
        color="success"
        aria-label="Upload image"
        @click="last = 'Upload image'"
      />
      <f-btn
        icon="users"
        circle
        size="small"
        color="warning"
        aria-label="Invite people"
        @click="last = 'Invite people'"
      />
    </f-speed-dial>

    <p class="hint">Last action: {{ last || 'none yet' }}</p>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
