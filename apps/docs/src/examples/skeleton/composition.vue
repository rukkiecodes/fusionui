<template>
  <div class="grid">
    <div class="cell">
      <span class="label">type="text@3"</span>
      <f-skeleton type="text@3" />
    </div>

    <div class="cell">
      <span class="label">type="image, heading, text@2, actions"</span>
      <f-skeleton type="image, heading, text@2, actions" />
    </div>

    <div class="cell">
      <span class="label">:type="['avatar', 'sentences', 'divider', 'chip']"</span>
      <f-skeleton :type="['avatar', 'sentences', 'divider', 'chip']" />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
