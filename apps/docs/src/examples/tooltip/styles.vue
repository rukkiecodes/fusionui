<template>
  <div class="row">
    <f-tooltip text="Shadow" shadow color="primary">
      <f-btn variant="border">Shadow</f-btn>
    </f-tooltip>
    <f-tooltip text="Border" border color="primary">
      <f-btn variant="border">Border</f-btn>
    </f-tooltip>
    <f-tooltip text="Thick edge" border-thick color="primary">
      <f-btn variant="border">Border thick</f-btn>
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
