<script setup>
import { ref } from 'vue'
const active = ref('home')
</script>

<template>
  <div class="sb">
    <f-sidebar v-model="active" permanent reduce hover-expand>
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
      <f-sidebar-item id="chat">
        <template #icon><f-icon icon="message-circle" size="small" /></template>
        Chat
      </f-sidebar-item>
    </f-sidebar>
    <p class="sb__hint">Hover the rail — it expands while the mouse is over it.</p>
  </div>
</template>

<style scoped>
.sb {
  position: relative;
  width: 100%;
  max-width: 640px;
  height: 420px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
.sb__hint {
  position: absolute;
  right: 18px;
  bottom: 16px;
  margin: 0;
  font-size: 0.82rem;
  opacity: 0.55;
}
</style>
