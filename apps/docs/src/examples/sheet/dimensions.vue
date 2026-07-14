<template>
  <div class="row">
    <f-sheet color="primary" :width="120" :height="120" rounded class="tile">120 × 120</f-sheet>
    <f-sheet color="success" width="100%" :max-width="260" :min-height="120" rounded class="tile">
      max-width 260
    </f-sheet>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.tile {
  display: grid;
  place-items: center;
  padding: 16px;
  text-align: center;
  font-size: 0.875rem;
}
</style>
