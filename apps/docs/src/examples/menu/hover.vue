<template>
  <f-menu open-on-hover location="bottom">
    <template #activator="{ props }">
      <f-btn v-bind="props" variant="flat" color="primary">Hover me</f-btn>
    </template>
    <button class="m-item">Account</button>
    <button class="m-item">Billing</button>
    <button class="m-item">Team</button>
  </f-menu>
</template>

<style scoped>
.m-item {
  display: block;
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
</style>
