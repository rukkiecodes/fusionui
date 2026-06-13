<script setup>
import { ref } from 'vue'
const active = ref('guide')
</script>

<template>
  <div class="nv">
    <f-navbar v-model="active" color="#7d33ff" text-white square shadow>
      <template #left>
        <f-icon icon="feather" />
        <strong class="nv__brand">FusionUI</strong>
      </template>
      <f-navbar-item id="guide">Guide</f-navbar-item>
      <f-navbar-item id="documents">Documents</f-navbar-item>
      <f-navbar-item id="components">Components</f-navbar-item>
      <template #right>
        <f-btn variant="text" size="small">Login</f-btn>
        <f-btn variant="outlined" size="small" color="#ffffff">Get Started</f-btn>
      </template>
    </f-navbar>
    <div class="nv__page"><code>square</code> removes the corner radius.</div>
  </div>
</template>

<style scoped>
.nv {
  position: relative;
  width: 100%;
  max-width: 660px;
  border-radius: 14px;
  overflow: hidden;
}
.nv__brand {
  margin-left: 6px;
}
.nv__page {
  display: grid;
  place-items: center;
  height: 120px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
  font-size: 0.85rem;
  opacity: 0.65;
}
.nv__page code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 1px 6px;
  border-radius: 5px;
}
</style>
