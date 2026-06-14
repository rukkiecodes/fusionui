<template>
  <div class="row">
    <f-avatar badge image="https://i.pravatar.cc/120?img=5" />
    <f-avatar badge badge-color="success" circle image="https://i.pravatar.cc/120?img=8" />
    <f-avatar badge badge-position="top-right" color="primary" text="TR" />
    <f-avatar color="primary" text="99">
      <template #badge>9+</template>
    </f-avatar>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 22px;
}
</style>
