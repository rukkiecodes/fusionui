<script setup>
import { ref } from 'vue'
const active = ref('home')
const reduce = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 640px">
    <f-btn variant="flat" size="small" style="align-self: center" @click="reduce = !reduce">
      {{ reduce ? 'Expand' : 'Reduce' }}
    </f-btn>
    <div class="sidebar-demo">
      <f-sidebar v-model="active" permanent :reduce="reduce" hover-expand>
        <template #logo>
          <f-icon icon="feather" color="primary" size="medium" />
        </template>

        <f-sidebar-item id="home">
          <template #icon><f-icon icon="home" size="small" /></template>
          Home
        </f-sidebar-item>
        <f-sidebar-item id="chat">
          <template #icon><f-icon icon="message-circle" size="small" /></template>
          Chat
        </f-sidebar-item>
        <f-sidebar-item id="friends">
          <template #icon><f-icon icon="users" size="small" /></template>
          Friends
        </f-sidebar-item>
        <f-sidebar-item id="library">
          <template #icon><f-icon icon="folder" size="small" /></template>
          Library
        </f-sidebar-item>
      </f-sidebar>
    </div>
  </div>
</template>

<style scoped>
.sidebar-demo {
  width: 100%;
  height: 380px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
