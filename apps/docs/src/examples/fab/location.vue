<template>
  <!-- `absolute` anchors the FAB to the nearest positioned ancestor — this panel. -->
  <div class="screen">
    <f-fab absolute location="top start" icon="chevron-left" size="small" color="dark" />
    <f-fab absolute location="top end" icon="more-vertical" size="small" variant="tonal" />
    <f-fab absolute location="bottom start" icon="filter" color="success" />
    <f-fab absolute location="bottom end" icon="plus" />
  </div>
</template>

<style scoped>
.screen {
  position: relative;
  height: 260px;
  border-radius: var(--fui-radius-lg);
  border: 1px dashed rgba(var(--fui-theme-on-surface), 0.18);
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
