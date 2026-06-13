<script setup>
import { FLoadingSpinner } from '@fusionui/vue'

const types = [
  'default',
  'points',
  'scale',
  'square',
  'square-rotate',
  'gradient',
  'rectangle',
  'circles',
  'border',
  'waves',
  'corners',
]
</script>

<template>
  <div class="lt">
    <div v-for="t in types" :key="t" class="lt__cell">
      <FLoadingSpinner :type="t" color="primary" />
      <span class="lt__name">{{ t }}</span>
    </div>
  </div>
</template>

<style scoped>
.lt {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
  gap: 12px;
  width: 100%;
}
.lt__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 22px 8px 14px;
  border: 1px solid rgba(var(--fui-border-color), var(--fui-border-opacity, 0.12));
  border-radius: var(--fui-radius-md);
  background: rgb(var(--fui-theme-surface));
}
.lt__name {
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.6;
}
</style>
