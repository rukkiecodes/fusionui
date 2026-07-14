<template>
  <div class="stack">
    <div class="region">
      <span class="tag">App</span>
      <f-btn>Save</f-btn>
      <f-btn>Cancel</f-btn>
      <f-chip>Draft</f-chip>
    </div>

    <!-- Everything inside this subtree gets the compact toolbar look. -->
    <f-defaults-provider
      :defaults="{
        global: { size: 'small' },
        FBtn: { variant: 'text' },
        FChip: { variant: 'outlined' },
      }"
    >
      <div class="region">
        <span class="tag">Toolbar</span>
        <f-btn prepend-icon="save">Save</f-btn>
        <f-btn prepend-icon="trash-2">Delete</f-btn>
        <f-chip>Draft</f-chip>
        <f-btn variant="flat" color="primary">Publish</f-btn>
      </div>
    </f-defaults-provider>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.region {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px;
  border-radius: var(--fui-radius-lg);
  background: rgba(var(--fui-theme-on-surface), 0.03);
}

.tag {
  width: 64px;
  font-size: 0.72rem;
  color: rgba(var(--fui-theme-on-surface), 0.5);
}
</style>
