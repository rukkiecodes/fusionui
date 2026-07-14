<script setup lang="ts">
import { ref } from 'vue'

const stack = ref('vue')

const frameworks = ['vue', 'react', 'svelte', 'solid', 'angular', 'qwik', 'astro']
</script>

<template>
  <div class="stack">
    <f-chip-group v-model="stack" mandatory filter>
      <f-chip v-for="name in frameworks" :key="name" :value="name">{{ name }}</f-chip>
    </f-chip-group>

    <p class="state">Selected: {{ stack }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.state {
  margin: 0;
  font-family: var(--fui-font-family-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
}
</style>
