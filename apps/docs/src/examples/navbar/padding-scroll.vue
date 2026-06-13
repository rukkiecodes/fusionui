<script setup>
import { ref } from 'vue'
const active = ref('guide')
</script>

<template>
  <div class="ps">
    <f-navbar v-model="active" padding-scroll square shadow target-scroll=".ps__scroll">
      <template #left>
        <f-icon icon="feather" color="primary" />
        <strong class="ps__brand">FusionUI</strong>
      </template>
      <f-navbar-item id="guide">Guide</f-navbar-item>
      <f-navbar-item id="documents">Documents</f-navbar-item>
      <f-navbar-item id="components">Components</f-navbar-item>
      <template #right>
        <f-btn variant="flat" size="small" color="primary">Get Started</f-btn>
      </template>
    </f-navbar>

    <div class="ps__scroll">
      <div class="ps__content">
        <p class="ps__hint">At the top the bar has breathing room — it compresses as you scroll.</p>
        <div v-for="n in 10" :key="n" class="ps__block">Section {{ n }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ps {
  position: relative;
  width: 100%;
  max-width: 660px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.1);
}
.ps :deep(.fui-navbar) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgb(var(--fui-theme-surface));
}
.ps__brand {
  margin-left: 6px;
}
.ps__scroll {
  height: 260px;
  overflow-y: auto;
}
.ps__content {
  padding: 96px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ps__hint {
  opacity: 0.7;
  font-size: 0.88rem;
}
.ps__block {
  padding: 18px;
  border-radius: 10px;
  background: rgba(var(--fui-theme-on-surface), 0.04);
}
</style>
