<template>
  <div class="row">
    <f-chip color="success" prepend-icon="$success">Payment received</f-chip>
    <f-chip color="warning" prepend-icon="$warning">Card expiring</f-chip>
    <f-chip color="primary" prepend-icon="star">Featured</f-chip>
    <f-chip color="dark" prepend-icon="map-pin">Lisbon</f-chip>
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
