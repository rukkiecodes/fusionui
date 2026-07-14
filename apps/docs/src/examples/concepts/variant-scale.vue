<script setup>
const variants = [
  'elevated',
  'flat',
  'tonal',
  'outlined',
  'text',
  'plain',
  'gradient',
  'relief',
  'line',
  'floating',
  'shadow',
]
</script>

<template>
  <div class="grid">
    <f-btn v-for="variant in variants" :key="variant" :variant="variant">
      {{ variant }}
    </f-btn>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px 12px;
  width: 100%;
}
</style>
