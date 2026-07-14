<template>
  <div class="row">
    <f-theme-provider theme="dark" class="panel">
      <span class="tag">theme only</span>
      <f-btn size="small" variant="tonal">Retry</f-btn>
      <f-chip>Queued</f-chip>
    </f-theme-provider>

    <f-theme-provider theme="dark" with-background class="panel">
      <span class="tag">with-background</span>
      <f-btn size="small" variant="tonal">Retry</f-btn>
      <f-chip>Queued</f-chip>
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
  border: 1px dashed rgba(var(--fui-border-color), 0.2);
}

.tag {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(var(--fui-theme-on-surface), 0.6);
}
</style>
