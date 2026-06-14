<script setup>
import { ref } from 'vue'
const value = ref(['vue', 'react'])
const items = [
  { title: 'Vue', value: 'vue' },
  { title: 'React', value: 'react' },
  { title: 'Svelte', value: 'svelte' },
  { title: 'Angular', value: 'angular' },
  { title: 'Solid', value: 'solid' },
  { title: 'Qwik', value: 'qwik' },
]
</script>

<template>
  <div class="w">
    <f-select v-model="value" :items="items" multiple collapse-chips label="Frameworks" />
    <code>{{ value }}</code>
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
  gap: 12px;
}
code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
