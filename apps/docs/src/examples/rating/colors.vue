<template>
  <div class="stack">
    <f-rating :model-value="4" color="warning" aria-label="Warning rating" />
    <f-rating :model-value="4" color="danger" aria-label="Danger rating" />
    <f-rating :model-value="4" color="primary" size="large" aria-label="Large rating" />
    <f-rating :model-value="4" color="success" size="small" aria-label="Small rating" />
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
