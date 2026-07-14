<template>
  <div class="scroller">
    <f-system-bar window color="primary">
      <f-icon icon="info" size="x-small" />
      <span>This bar stays put while the panel scrolls</span>
    </f-system-bar>

    <p v-for="n in 8" :key="n" class="line">Line {{ n }} of scrolling content.</p>
  </div>
</template>

<style scoped>
.scroller {
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid rgb(var(--fui-theme-on-surface) / 12%);
  border-radius: 12px;
}
.line {
  padding: 12px 16px;
  margin: 0;
}
</style>
