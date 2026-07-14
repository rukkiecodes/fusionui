<script setup lang="ts">
import { ref } from 'vue'

const role = ref<string | null>('Engineering manager')
const roles = [
  'Product designer',
  'Engineering manager',
  'Data analyst',
  'Support lead',
  'Technical writer',
]
</script>

<template>
  <div class="w">
    <f-combobox
      v-model="role"
      :items="roles"
      label="Job title"
      placeholder="Pick one, or type your own"
      hint="Anything you type is committed on Enter or on blur"
      persistent-hint
      clearable
    />
    <code>{{ role ?? 'null' }}</code>
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
