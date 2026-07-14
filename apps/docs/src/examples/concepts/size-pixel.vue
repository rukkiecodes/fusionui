<template>
  <div class="rows">
    <div class="row">
      <f-avatar size="x-small" text="XS" />
      <f-avatar size="small" text="SM" />
      <f-avatar size="default" text="MD" />
      <f-avatar size="large" text="LG" />
      <f-avatar :size="96" text="96" />
    </div>

    <div class="row">
      <f-icon icon="zap" size="x-small" />
      <f-icon icon="zap" size="small" />
      <f-icon icon="zap" size="default" />
      <f-icon icon="zap" size="medium" />
      <f-icon icon="zap" size="large" />
      <f-icon icon="zap" :size="64" />
    </div>
  </div>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style>
