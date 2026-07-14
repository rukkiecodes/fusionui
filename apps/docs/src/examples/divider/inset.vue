<template>
  <div class="panel">
    <div class="row">
      <f-avatar circle size="small" image="https://i.pravatar.cc/120?img=45" />
      <span>Ada Lovelace</span>
    </div>

    <f-divider inset />

    <div class="row">
      <f-avatar circle size="small" image="https://i.pravatar.cc/120?img=52" />
      <span>Grace Hopper</span>
    </div>

    <f-divider inset />

    <div class="row">
      <f-avatar circle size="small" image="https://i.pravatar.cc/120?img=68" />
      <span>Alan Turing</span>
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 0.9rem;
}
</style>
