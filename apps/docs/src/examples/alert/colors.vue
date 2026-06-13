<script setup>
import { ref } from 'vue'
const color = ref('danger')
const options = [
  { label: 'Primary', value: 'primary' },
  { label: 'Success', value: 'success' },
  { label: 'Danger', value: 'danger' },
  { label: 'Warn', value: 'warning' },
  { label: 'Dark', value: 'dark' },
  { label: 'HEX', value: '#7d33ff' },
  { label: 'RGB', value: 'rgb(59,222,200)' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 620px">
    <f-alert :color="color">
      <template #title>FusionUI Framework</template>
      FusionUI is a <b>UI component library</b> built with <a href="https://vuejs.org/">Vue</a> for
      shipping beautiful interfaces fast — created from scratch with a unique, pleasant style for
      every kind of developer, from frontend lovers to backend devs who want a polished result with
      ease.
    </f-alert>

    <div class="color-btns">
      <f-btn
        v-for="o in options"
        :key="o.value"
        variant="tonal"
        :color="o.value"
        :active="color === o.value"
        @click="color = o.value"
      >
        {{ o.label }}
      </f-btn>
    </div>
  </div>
</template>

<style scoped>
.color-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.color-btns :deep(.fui-btn--active) {
  transform: translateY(-4px);
  border-radius: 0 0 12px 12px;
}
</style>
