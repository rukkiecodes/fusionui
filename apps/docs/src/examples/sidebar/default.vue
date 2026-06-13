<script setup>
import { ref } from 'vue'
const active = ref('home')
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
      <f-sidebar-item id="market">
        <template #icon><f-icon icon="shopping-cart" size="small" /></template>
        Market Overview
      </f-sidebar-item>
      <f-sidebar-item id="music">
        <template #icon><f-icon icon="music" size="small" /></template>
        Music
      </f-sidebar-item>
      <f-sidebar-item id="donate">
        <template #icon><f-icon icon="heart" size="small" /></template>
        Donate
      </f-sidebar-item>
      <f-sidebar-item id="drive">
        <template #icon><f-icon icon="hard-drive" size="small" /></template>
        Drive
      </f-sidebar-item>

      <template #footer>
        <f-sidebar-item id="settings">
          <template #icon><f-icon icon="settings" size="small" /></template>
          Settings
        </f-sidebar-item>
      </template>
    </f-sidebar>
  </div>
</template>

<style scoped>
.sidebar-demo {
  width: 100%;
  max-width: 640px;
  height: 420px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
