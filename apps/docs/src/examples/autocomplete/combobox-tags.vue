<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['vue', 'design-system'])
const suggested = ['vue', 'typescript', 'design-system', 'accessibility', 'ssr', 'performance']
</script>

<template>
  <div class="w">
    <f-combobox
      v-model="tags"
      :items="suggested"
      multiple
      closable-chips
      color="primary"
      label="Tags"
      placeholder="Type a tag, press Enter"
    />
    <code>{{ tags }}</code>
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
