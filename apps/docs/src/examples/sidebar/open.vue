<script setup>
import { ref } from 'vue'
const active = ref('home')
const open = ref(false)
</script>

<template>
  <div class="app">
    <div class="app__bar">
      <f-btn variant="flat" size="small" color="primary" icon="menu" @click="open = true" />
      <strong>My App</strong>
    </div>

    <f-sidebar v-model="active" v-model:open="open">
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
      <f-sidebar-item id="chat">
        <template #icon><f-icon icon="message-circle" size="small" /></template>
        Chat
      </f-sidebar-item>
    </f-sidebar>

    <div class="app__body">Press the menu button to open the drawer; click outside to close.</div>
  </div>
</template>

<style scoped>
/* transform establishes a containing block so the fixed drawer stays in the demo */
.app {
  position: relative;
  width: 100%;
  max-width: 640px;
  height: 440px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
  transform: translateZ(0);
}
.app__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}
.app__body {
  display: grid;
  place-items: center;
  height: calc(100% - 58px);
  padding: 0 24px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
