<script setup>
import { ref } from 'vue'
const active = ref('alert')
</script>

<template>
  <div class="sidebar-demo">
    <vd-sidebar v-model="active" permanent>
      <template #logo>
        <vd-icon icon="feather" color="primary" size="medium" />
      </template>

      <vd-sidebar-item id="home">
        <template #icon><vd-icon icon="home" size="small" /></template>
        Home
      </vd-sidebar-item>

      <vd-sidebar-group open>
        <template #header>
          <vd-sidebar-item>
            <template #icon><vd-icon icon="grid" size="small" /></template>
            Components
          </vd-sidebar-item>
        </template>

        <vd-sidebar-item id="button">Button</vd-sidebar-item>
        <vd-sidebar-item id="card">Card</vd-sidebar-item>
        <vd-sidebar-item id="alert">Alert</vd-sidebar-item>
        <vd-sidebar-item id="input">Input</vd-sidebar-item>
      </vd-sidebar-group>

      <vd-sidebar-item id="docs">
        <template #icon><vd-icon icon="book-open" size="small" /></template>
        Documentation
      </vd-sidebar-item>
    </vd-sidebar>
  </div>
</template>

<style scoped>
.sidebar-demo {
  width: 100%;
  max-width: 640px;
  height: 460px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--vd-theme-on-surface), 0.03);
}
</style>
