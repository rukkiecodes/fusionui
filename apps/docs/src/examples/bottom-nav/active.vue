<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('feed')
const visible = ref(true)
</script>

<template>
  <div class="wrap">
    <f-btn variant="tonal" @click="visible = !visible">
      {{ visible ? 'Hide' : 'Show' }} the bar
    </f-btn>

    <div class="phone">
      <div class="phone__screen">Scroll down and the bar can slide away.</div>

      <f-bottom-nav v-model="tab" :active="visible" grow mandatory>
        <f-bottom-nav-item value="feed" icon="home" text="Feed" />
        <f-bottom-nav-item value="explore" icon="compass" text="Explore" />
        <f-bottom-nav-item value="saved" icon="bookmark" text="Saved" />
      </f-bottom-nav>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.phone {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
.phone__screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  padding: 0 16px;
  text-align: center;
  font-size: 0.9rem;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
