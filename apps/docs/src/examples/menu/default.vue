<template>
  <f-menu location="bottom-end">
    <template #activator="{ props }">
      <f-btn v-bind="props" color="primary">Open menu</f-btn>
    </template>

    <button class="m-item"><f-icon icon="user" size="small" /> Profile</button>
    <button class="m-item"><f-icon icon="settings" size="small" /> Settings</button>
    <div class="m-sep" />
    <button class="m-item m-item--danger"><f-icon icon="log-out" size="small" /> Sign out</button>
  </f-menu>
</template>

<style scoped>
.m-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  border-radius: var(--fui-radius-sm);
  cursor: pointer;
}
.m-item:hover {
  background: rgba(var(--fui-theme-on-background), 0.06);
}
.m-item--danger {
  color: rgb(var(--fui-theme-danger));
}
.m-sep {
  height: 1px;
  margin: 6px 4px;
  background: rgba(var(--fui-theme-on-background), 0.1);
}
</style>
