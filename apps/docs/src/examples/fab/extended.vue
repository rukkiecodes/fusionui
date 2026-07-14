<template>
  <div class="row">
    <f-fab extended icon="plus" text="New invoice" />
    <f-fab extended icon="download" text="Export CSV" color="success" variant="tonal" />
    <f-fab extended icon="message-square" color="dark">Send feedback</f-fab>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
