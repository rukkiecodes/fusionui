<script setup>
const locations = ['bottom', 'bottom-end', 'top', 'top-end']
</script>

<template>
  <div class="row">
    <f-menu v-for="loc in locations" :key="loc" :location="loc">
      <template #activator="{ props }">
        <f-btn v-bind="props" variant="outlined">{{ loc }}</f-btn>
      </template>
      <button class="m-item">First item</button>
      <button class="m-item">Second item</button>
      <button class="m-item">Third item</button>
    </f-menu>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.m-item {
  display: block;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  border-radius: var(--fui-radius-sm);
  cursor: pointer;
}
.m-item:hover {
  background: rgba(var(--fui-theme-on-background), 0.06);
}
</style>
