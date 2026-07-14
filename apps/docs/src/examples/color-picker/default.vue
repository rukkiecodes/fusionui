<script setup lang="ts">
import { ref } from 'vue'

const brand = ref('#2563eb')
</script>

<template>
  <div class="w">
    <f-color-picker v-model="brand" mode="hex" />

    <div class="chip">
      <span class="chip__dot" :style="{ background: brand }" />
      <code>{{ brand }}</code>
    </div>
  </div>
</template>

<style scoped>
.w {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chip__dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.15);
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
