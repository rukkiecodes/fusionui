<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['accessibility', 'design-system'])

const all = [
  'accessibility',
  'design-system',
  'performance',
  'typescript',
  'testing',
  'animation',
  'tooling',
  'documentation',
]
</script>

<template>
  <f-chip-group v-model="tags" multiple column filter color="secondary" variant="outlined">
    <f-chip v-for="tag in all" :key="tag" :value="tag">{{ tag }}</f-chip>
  </f-chip-group>
</template>
