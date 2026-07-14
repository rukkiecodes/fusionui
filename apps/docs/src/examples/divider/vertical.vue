<template>
  <div class="toolbar">
    <f-btn variant="text" prepend-icon="edit-2">Edit</f-btn>
    <f-divider vertical />
    <f-btn variant="text" prepend-icon="download">Export</f-btn>
    <f-divider vertical />
    <f-btn variant="text" color="danger" prepend-icon="trash-2">Delete</f-btn>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
}
</style>
