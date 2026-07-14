<template>
  <div class="stack">
    <div class="row">
      <span class="tag">Outside</span>
      <f-btn>Save</f-btn>
      <f-btn>Cancel</f-btn>
    </div>

    <f-defaults-provider :defaults="{ FBtn: { variant: 'tonal', color: 'success' } }">
      <div class="row">
        <span class="tag">Inside</span>
        <f-btn>Save</f-btn>
        <f-btn>Cancel</f-btn>
        <f-btn color="danger">Delete</f-btn>
      </div>
    </f-defaults-provider>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  width: 64px;
  font-size: 0.72rem;
  color: rgba(var(--fui-theme-on-surface), 0.5);
}
</style>
