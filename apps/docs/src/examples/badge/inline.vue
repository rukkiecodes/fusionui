<template>
  <div class="stack">
    <f-badge inline content="24" color="primary">
      <span class="label">Open pull requests</span>
    </f-badge>

    <f-badge inline dot color="success">
      <span class="label">Build passing</span>
    </f-badge>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.label {
  font-size: 0.95rem;
}
</style>
