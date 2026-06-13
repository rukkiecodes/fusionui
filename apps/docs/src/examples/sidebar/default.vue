<script setup>
import { ref } from 'vue'
const active = ref('home')
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
      <vd-sidebar-item id="market">
        <template #icon><vd-icon icon="shopping-cart" size="small" /></template>
        Market Overview
      </vd-sidebar-item>
      <vd-sidebar-item id="music">
        <template #icon><vd-icon icon="music" size="small" /></template>
        Music
      </vd-sidebar-item>
      <vd-sidebar-item id="donate">
        <template #icon><vd-icon icon="heart" size="small" /></template>
        Donate
      </vd-sidebar-item>
      <vd-sidebar-item id="drive">
        <template #icon><vd-icon icon="hard-drive" size="small" /></template>
        Drive
      </vd-sidebar-item>

      <template #footer>
        <vd-sidebar-item id="settings">
          <template #icon><vd-icon icon="settings" size="small" /></template>
          Settings
        </vd-sidebar-item>
      </template>
    </vd-sidebar>
  </div>
</template>

<style scoped>
.sidebar-demo {
  width: 100%;
  max-width: 640px;
  height: 420px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--vd-theme-on-surface), 0.03);
}
</style>
