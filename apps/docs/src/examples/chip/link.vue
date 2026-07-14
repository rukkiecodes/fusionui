<template>
  <div class="row">
    <f-chip link color="primary" prepend-icon="filter">Open issues</f-chip>
    <f-chip link color="primary" prepend-icon="filter">Assigned to me</f-chip>
    <f-chip link variant="outlined" color="primary">Clear filters</f-chip>
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
