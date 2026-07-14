<template>
  <div class="row">
    <f-kbd keys="ctrl+k" />
    <f-kbd color="primary" keys="ctrl+k" />
    <f-kbd color="success" keys="ctrl+k" />
    <f-kbd color="danger" border keys="ctrl+k" />
    <f-kbd color="#7c3aed" rounded elevation="2">Space</f-kbd>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
