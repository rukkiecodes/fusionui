<template>
  <div class="row">
    <f-tooltip text="Rounded" circle color="primary">
      <f-btn variant="border">Circle</f-btn>
    </f-tooltip>
    <f-tooltip text="Square" square color="primary">
      <f-btn variant="border">Square</f-btn>
    </f-tooltip>
    <f-tooltip text="No arrow" not-arrow color="primary">
      <f-btn variant="border">No arrow</f-btn>
    </f-tooltip>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
