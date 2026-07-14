<template>
  <div class="stack">
    <f-system-bar color="warning">
      <f-icon icon="alert-triangle" size="x-small" />
      <span>Staging environment — data here is not real</span>
    </f-system-bar>

    <f-system-bar color="danger">
      <f-icon icon="wifi-off" size="x-small" />
      <span>You are offline. Changes will sync when you reconnect.</span>
    </f-system-bar>

    <f-system-bar color="primary">
      <f-icon icon="user" size="x-small" />
      <span>Viewing as priya@acme.com</span>
      <f-spacer />
      <span>Exit</span>
    </f-system-bar>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
