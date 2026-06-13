<script setup>
import { ref } from 'vue'
const active = ref('guide')
</script>

<template>
  <div class="navbar-demo">
    <vd-navbar v-model="active" shadow square>
      <template #left>
        <vd-icon icon="feather" color="primary" />
        <strong style="margin-left: 6px">Vue DL</strong>
      </template>

      <vd-navbar-item id="guide">Guide</vd-navbar-item>
      <vd-navbar-item id="docs">Docs</vd-navbar-item>
      <vd-navbar-item id="components">Components</vd-navbar-item>
      <vd-navbar-item id="license">License</vd-navbar-item>

      <template #right>
        <vd-btn variant="text" size="small">Login</vd-btn>
        <vd-btn variant="flat" size="small" color="primary">Get Started</vd-btn>
      </template>
    </vd-navbar>
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
  background: rgba(var(--vd-theme-on-surface), 0.03);
}
.navbar-demo .vd-navbar {
  position: absolute;
}
</style>
