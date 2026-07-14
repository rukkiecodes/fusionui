<template>
  <div class="row">
    <f-badge content="4">
      <f-icon icon="inbox" size="large" />
    </f-badge>

    <f-badge content="12">
      <f-btn variant="tonal" prepend-icon="shopping-cart">Cart</f-btn>
    </f-badge>

    <f-badge color="primary">
      <template #badge>9+</template>
      <f-avatar circle image="https://i.pravatar.cc/120?img=32" />
    </f-badge>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
</style>
