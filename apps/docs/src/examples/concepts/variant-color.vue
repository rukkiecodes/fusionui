<script setup>
const colors = ['primary', 'secondary', 'success', 'danger', 'warning']
const variants = ['elevated', 'tonal', 'outlined', 'text', 'gradient']
</script>

<template>
  <div class="matrix">
    <template v-for="variant in variants" :key="variant">
      <span class="label">{{ variant }}</span>
      <div class="row">
        <f-btn v-for="color in colors" :key="color" :variant="variant" :color="color" size="small">
          {{ color }}
        </f-btn>
      </div>
    </template>
  </div>
</template>

<style scoped>
.matrix {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 14px 16px;
  width: 100%;
}
.label {
  font-size: 0.8rem;
  font-family: var(--fui-font-family-mono, monospace);
  opacity: 0.6;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
