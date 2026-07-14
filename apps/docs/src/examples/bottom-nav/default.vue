<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('home')
</script>

<template>
  <div class="phone">
    <div class="phone__screen">
      Current destination: <strong>{{ tab }}</strong>
    </div>

    <f-bottom-nav v-model="tab" mandatory>
      <f-bottom-nav-item value="home" icon="home" text="Home" />
      <f-bottom-nav-item value="search" icon="search" text="Search" />
      <f-bottom-nav-item value="orders" icon="shopping-bag" text="Orders" />
      <f-bottom-nav-item value="account" icon="user" text="Account" />
    </f-bottom-nav>
  </div>
</template>

<style scoped>
.phone {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: var(--fui-radius-lg);
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
}
.phone__screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  font-size: 0.9rem;
  background: rgba(var(--fui-theme-on-surface), 0.03);
}
</style>
