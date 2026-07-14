<script setup>
import { ref } from 'vue'

const labels = ref(['bug', 'a11y'])
const allLabels = [
  { title: 'bug', value: 'bug' },
  { title: 'accessibility', value: 'a11y' },
  { title: 'documentation', value: 'docs' },
  { title: 'enhancement', value: 'enhancement' },
  { title: 'good first issue', value: 'good-first-issue' },
  { title: 'regression', value: 'regression' },
]
</script>

<template>
  <div class="w">
    <f-autocomplete
      v-model="labels"
      :items="allLabels"
      multiple
      closable-chips
      collapse-chips
      color="success"
      label="Labels"
    />
    <code>{{ labels }}</code>
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
