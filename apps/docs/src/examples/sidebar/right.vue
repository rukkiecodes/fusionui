<script setup>
import { ref } from 'vue'
const active = ref('home')
</script>

<template>
  <div class="rt">
    <div class="rt__body">Content sits on the left; the drawer docks on the right.</div>

    <f-sidebar v-model="active" permanent right>
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
  </div>
</template>

<style scoped>
.rt {
  display: flex;
  width: 100%;
  max-width: 640px;
  height: 420px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
.rt__body {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 0 24px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
