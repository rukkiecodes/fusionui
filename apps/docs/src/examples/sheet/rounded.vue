<template>
  <div class="grid">
    <f-sheet tile elevation="2" class="tile">tile</f-sheet>
    <f-sheet elevation="2" class="tile">default</f-sheet>
    <f-sheet rounded elevation="2" class="tile">rounded</f-sheet>
    <f-sheet rounded="xl" elevation="2" class="tile">rounded="xl"</f-sheet>
    <f-sheet rounded="pill" elevation="2" class="tile">rounded="pill"</f-sheet>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 16px;
  padding: 8px;
}

.tile {
  display: grid;
  place-items: center;
  height: 80px;
  font-size: 0.8125rem;
}
</style>
