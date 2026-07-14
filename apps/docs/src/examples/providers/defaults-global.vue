<template>
  <div class="stack">
    <div class="row">
      <span class="tag">Default</span>
      <f-btn>Invite</f-btn>
      <f-chip>Owner</f-chip>
      <f-avatar text="AL" color="primary" />
    </div>

    <f-defaults-provider :defaults="{ global: { size: 'small' } }">
      <div class="row">
        <span class="tag">Compact</span>
        <f-btn>Invite</f-btn>
        <f-chip>Owner</f-chip>
        <f-avatar text="AL" color="primary" />
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
