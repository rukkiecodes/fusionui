<template>
  <div class="row">
    <f-tooltip text="Saving…" loading><f-btn variant="border">Default</f-btn></f-tooltip>
    <f-tooltip text="Saving…" loading color="primary"
      ><f-btn color="primary">Colored</f-btn></f-tooltip
    >
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
