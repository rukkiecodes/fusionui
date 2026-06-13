<script setup>
import { ref } from 'vue'
const active = ref('guide')
</script>

<template>
  <div class="navbar-demo">
    <f-navbar v-model="active" shadow square>
      <template #left>
        <f-icon icon="feather" color="primary" />
        <strong style="margin-left: 6px">FusionUI</strong>
      </template>

      <f-navbar-item id="guide">Guide</f-navbar-item>
      <f-navbar-item id="docs">Docs</f-navbar-item>
      <f-navbar-item id="components">Components</f-navbar-item>
      <f-navbar-item id="license">License</f-navbar-item>

      <template #right>
        <f-btn variant="text" size="small">Login</f-btn>
        <f-btn variant="flat" size="small" color="primary">Get Started</f-btn>
      </template>
    </f-navbar>
  </div>
</template>

<style scoped>
.navbar-demo {
  position: relative;
  width: 100%;
  max-width: 640px;
  height: 120px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
.navbar-demo .fui-navbar {
  position: absolute;
}
</style>
