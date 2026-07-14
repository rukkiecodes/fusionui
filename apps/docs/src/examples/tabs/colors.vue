<template>
  <div class="stack">
    <f-tabs color="success">
      <f-tab text="Deployments" />
      <f-tab text="Logs" />
      <f-tab text="Metrics" />
    </f-tabs>

    <f-tabs color="danger">
      <f-tab text="Deployments" />
      <f-tab text="Logs" />
      <f-tab text="Metrics" />
    </f-tabs>
  </div>
</template>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
</style>
