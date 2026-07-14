<template>
  <div class="grid">
    <f-skeleton type="card" elevation="1" />
    <f-skeleton boilerplate type="card" elevation="1" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
</style>
