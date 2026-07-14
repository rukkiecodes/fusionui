<script setup lang="ts">
import { ref } from 'vue'

type Rule = (value: unknown) => boolean | string

const workspace = ref('')

const rules: Rule[] = [
  v => !!String(v ?? '').trim() || 'A workspace name is required',
  v => String(v ?? '').length <= 24 || 'Keep it under 24 characters',
]
</script>

<template>
  <div class="w">
    <f-input v-model="workspace" label="Workspace name" :rules="rules" />
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
</style>
