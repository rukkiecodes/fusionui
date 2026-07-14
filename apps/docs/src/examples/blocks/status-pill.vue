<template>
  <div class="row">
    <f-status-pill dot color="success" label="Deployed" />
    <f-status-pill dot color="primary" label="Canary at 25%" />
    <f-status-pill dot color="warning" label="Awaiting approval" />
    <f-status-pill dot color="danger" label="Rolled back" />
    <f-status-pill color="dark" label="Archived" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
