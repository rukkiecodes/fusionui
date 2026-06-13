<template>
  <div class="d-flex" style="gap: 12px; align-items: center; flex-wrap: wrap">
    <f-btn color="primary" animation-type="horizontal">
      Hover me
      <template #animate><f-icon icon="arrow-right" size="1.2em" /></template>
    </f-btn>
    <f-btn color="success" variant="tonal" animation-type="vertical">
      Add to cart
      <template #animate><f-icon icon="shopping-cart" size="1.2em" /></template>
    </f-btn>
    <f-btn color="danger" variant="tonal" animation-type="scale">
      Delete
      <template #animate><f-icon icon="trash-2" size="1.2em" /></template>
    </f-btn>
    <f-btn color="dark" animation-type="rotate">
      Sync
      <template #animate><f-icon icon="refresh-cw" size="1.2em" /></template>
    </f-btn>
  </div>
</template>
