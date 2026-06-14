<template>
  <div class="row">
    <f-avatar size="x-small" color="primary" text="XS" />
    <f-avatar size="small" color="primary" text="SM" />
    <f-avatar color="primary" text="MD" />
    <f-avatar size="large" color="primary" text="LG" />
    <f-avatar size="x-large" color="primary" text="XL" />
    <f-avatar :size="92" color="primary" text="92" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
