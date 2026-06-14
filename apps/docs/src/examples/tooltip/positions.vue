<template>
  <div class="row">
    <f-tooltip text="Above" location="top"><f-btn variant="border">Top</f-btn></f-tooltip>
    <f-tooltip text="Below" location="bottom"><f-btn variant="border">Bottom</f-btn></f-tooltip>
    <f-tooltip text="To the left" location="left"><f-btn variant="border">Left</f-btn></f-tooltip>
    <f-tooltip text="To the right" location="right"
      ><f-btn variant="border">Right</f-btn></f-tooltip
    >
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
