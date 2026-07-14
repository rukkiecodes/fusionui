<template>
  <div class="row">
    <f-theme-provider theme="light" with-background class="panel">
      <span class="tag">Light</span>
      <f-btn size="small">Publish</f-btn>
      <f-btn size="small" variant="tonal" color="danger">Discard</f-btn>
    </f-theme-provider>

    <f-theme-provider theme="dark" with-background class="panel">
      <span class="tag">Dark</span>
      <f-btn size="small">Publish</f-btn>
      <f-btn size="small" variant="tonal" color="danger">Discard</f-btn>
    </f-theme-provider>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.panel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: var(--fui-radius-lg);
}

.tag {
  font-size: 0.72rem;
  font-weight: 500;
  opacity: 0.6;
}
</style>
