<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <div class="wrap">
    <f-btn variant="tonal" @click="visible = !visible">
      {{ visible ? 'Hide' : 'Show' }} the compose button
    </f-btn>

    <div class="screen">
      <f-fab v-model="visible" absolute location="bottom end" icon="edit-2" />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.screen {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: var(--fui-radius-lg);
  border: 1px dashed rgba(var(--fui-theme-on-surface), 0.18);
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
