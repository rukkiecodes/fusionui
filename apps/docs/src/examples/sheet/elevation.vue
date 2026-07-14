<template>
  <div class="grid">
    <f-sheet v-for="level in [0, 1, 3, 6, 12, 24]" :key="level" :elevation="level" class="tile">
      elevation {{ level }}
    </f-sheet>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 20px;
  padding: 8px;
}

.tile {
  display: grid;
  place-items: center;
  height: 80px;
  font-size: 0.875rem;
}
</style>
