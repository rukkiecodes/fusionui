<template>
  <div class="grid">
    <f-sheet class="tile">Surface</f-sheet>
    <f-sheet color="primary" class="tile">Primary</f-sheet>
    <f-sheet color="secondary" class="tile">Secondary</f-sheet>
    <f-sheet color="success" class="tile">Success</f-sheet>
    <f-sheet color="danger" class="tile">Danger</f-sheet>
    <f-sheet color="#0f766e" class="tile">#0f766e</f-sheet>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.tile {
  padding: 20px;
  font-weight: 500;
}
</style>
