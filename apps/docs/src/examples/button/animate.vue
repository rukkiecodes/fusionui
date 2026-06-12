<template>
  <div class="d-flex" style="gap: 12px; align-items: center; flex-wrap: wrap">
    <vd-btn color="primary" animation-type="horizontal">
      Hover me
      <template #animate><vd-icon icon="arrow-right" /></template>
    </vd-btn>
    <vd-btn color="success" variant="tonal" animation-type="vertical">
      Add to cart
      <template #animate><vd-icon icon="shopping-cart" /></template>
    </vd-btn>
    <vd-btn color="danger" variant="tonal" animation-type="scale">
      Delete
      <template #animate><vd-icon icon="trash-2" /></template>
    </vd-btn>
    <vd-btn color="dark" animation-type="rotate">
      Sync
      <template #animate><vd-icon icon="refresh-cw" /></template>
    </vd-btn>
  </div>
</template>
