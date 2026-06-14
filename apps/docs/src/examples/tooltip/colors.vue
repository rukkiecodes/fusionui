<template>
  <div class="row">
    <f-tooltip text="Default dark"><f-btn variant="border">Default</f-btn></f-tooltip>
    <f-tooltip text="Primary" color="primary"><f-btn color="primary">Primary</f-btn></f-tooltip>
    <f-tooltip text="Success" color="success"><f-btn color="success">Success</f-btn></f-tooltip>
    <f-tooltip text="Danger" color="danger"><f-btn color="danger">Danger</f-btn></f-tooltip>
    <f-tooltip text="Custom" color="#6d28d9"><f-btn color="#6d28d9">Custom</f-btn></f-tooltip>
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
