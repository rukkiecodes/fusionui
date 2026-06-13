<script setup>
import { ref } from 'vue'
const active = ref('guide')
</script>

<template>
  <div class="hs">
    <f-navbar v-model="active" hide-scroll square shadow target-scroll=".hs__scroll">
      <template #left>
        <f-icon icon="feather" color="primary" />
        <strong class="hs__brand">FusionUI</strong>
      </template>
      <f-navbar-item id="guide">Guide</f-navbar-item>
      <f-navbar-item id="documents">Documents</f-navbar-item>
      <f-navbar-item id="components">Components</f-navbar-item>
      <template #right>
        <f-btn variant="flat" size="small" color="primary">Get Started</f-btn>
      </template>
    </f-navbar>

    <div class="hs__scroll">
      <div class="hs__content">
        <p class="hs__hint">Scroll down — the bar slides away. Scroll back up — it returns.</p>
        <div v-for="n in 10" :key="n" class="hs__block">Section {{ n }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hs {
  position: relative;
  width: 100%;
  max-width: 660px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.1);
}
.hs :deep(.fui-navbar) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.hs__brand {
  margin-left: 6px;
}
.hs__scroll {
  height: 260px;
  overflow-y: auto;
}
.hs__content {
  padding: 66px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hs__hint {
  opacity: 0.7;
  font-size: 0.88rem;
}
.hs__block {
  padding: 18px;
  border-radius: 10px;
  background: rgba(var(--fui-theme-on-surface), 0.04);
}
</style>
