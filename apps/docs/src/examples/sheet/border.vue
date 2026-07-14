<template>
  <div class="grid">
    <f-sheet border rounded class="tile">Hairline on every side</f-sheet>
    <f-sheet border="s-lg" rounded class="tile">A thick leading edge</f-sheet>
    <f-sheet border color="primary" rounded class="tile">
      On a fill the border follows the text color
    </f-sheet>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.tile {
  padding: 20px;
  font-size: 0.9375rem;
}
</style>
