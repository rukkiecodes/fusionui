<template>
  <div class="row">
    <f-chip color="primary">In review</f-chip>
    <f-chip color="secondary">Draft</f-chip>
    <f-chip color="success">Deployed</f-chip>
    <f-chip color="warning">Degraded</f-chip>
    <f-chip color="danger">Failed</f-chip>
    <f-chip color="dark">Archived</f-chip>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
