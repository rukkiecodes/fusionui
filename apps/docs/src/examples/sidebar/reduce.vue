<script setup>
import { ref } from 'vue'
const active = ref('home')
const reduce = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 640px">
    <vd-btn variant="flat" size="small" style="align-self: center" @click="reduce = !reduce">
      {{ reduce ? 'Expand' : 'Reduce' }}
    </vd-btn>
    <div class="sidebar-demo">
      <vd-sidebar v-model="active" permanent :reduce="reduce" hover-expand>
        <template #logo>
          <vd-icon icon="feather" color="primary" size="medium" />
        </template>

        <vd-sidebar-item id="home">
          <template #icon><vd-icon icon="home" size="small" /></template>
          Home
        </vd-sidebar-item>
        <vd-sidebar-item id="chat">
          <template #icon><vd-icon icon="message-circle" size="small" /></template>
          Chat
        </vd-sidebar-item>
        <vd-sidebar-item id="friends">
          <template #icon><vd-icon icon="users" size="small" /></template>
          Friends
        </vd-sidebar-item>
        <vd-sidebar-item id="library">
          <template #icon><vd-icon icon="folder" size="small" /></template>
          Library
        </vd-sidebar-item>
      </vd-sidebar>
    </div>
  </div>
</template>

<style scoped>
.sidebar-demo {
  width: 100%;
  height: 380px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(var(--vd-theme-on-surface), 0.03);
}
</style>
