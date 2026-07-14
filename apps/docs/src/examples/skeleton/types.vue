<script setup lang="ts">
const types = ['article', 'card', 'list-item-avatar-two-line', 'table-row'] as const
</script>

<template>
  <div class="grid">
    <div v-for="type in types" :key="type" class="cell">
      <span class="label">{{ type }}</span>
      <f-skeleton :type="type" elevation="1" />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-family: var(--fui-font-family-mono);
  font-size: 0.75rem;
  opacity: 0.6;
}
</style>
