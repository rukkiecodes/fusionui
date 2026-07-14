<script setup lang="ts">
import { ref } from 'vue'

const category = ref('all')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'infra', label: 'Infrastructure' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Documentation' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'security', label: 'Security' },
]
</script>

<template>
  <div class="stack">
    <f-slide-group v-model="category" mandatory>
      <f-slide-group-item
        v-for="item in categories"
        :key="item.value"
        :value="item.value"
        :text="item.label"
      />
    </f-slide-group>

    <p class="state">Selected: {{ category }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.state {
  margin: 0;
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
