<script setup>
import { ref } from 'vue'
const active = ref('alert')
</script>

<template>
  <div class="sidebar-demo">
    <f-sidebar v-model="active" permanent>
      <template #logo>
        <f-icon icon="feather" color="primary" size="medium" />
      </template>

      <f-sidebar-item id="home">
        <template #icon><f-icon icon="home" size="small" /></template>
        Home
      </f-sidebar-item>

      <f-sidebar-group open>
        <template #header>
          <f-sidebar-item>
            <template #icon><f-icon icon="grid" size="small" /></template>
            Components
          </f-sidebar-item>
        </template>

        <f-sidebar-item id="button">Button</f-sidebar-item>
        <f-sidebar-item id="card">Card</f-sidebar-item>
        <f-sidebar-item id="alert">Alert</f-sidebar-item>
        <f-sidebar-item id="input">Input</f-sidebar-item>
      </f-sidebar-group>

      <f-sidebar-item id="docs">
        <template #icon><f-icon icon="book-open" size="small" /></template>
        Documentation
      </f-sidebar-item>
    </f-sidebar>
  </div>
</template>

<style scoped>
.sidebar-demo {
  width: 100%;
  max-width: 640px;
  height: 460px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
