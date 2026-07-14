<template>
  <div class="row">
    <f-skeleton type="ossein" :width="180" :height="90" />
    <f-skeleton type="text" :width="220" />
    <f-skeleton type="avatar" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}
</style>
