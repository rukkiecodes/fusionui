<script setup>
import { ref } from 'vue'
const active = ref('primary')
const color = ref('primary')
const colors = ['primary', 'success', 'danger', 'warning', 'dark']
</script>

<template>
  <div class="nv">
    <f-navbar v-model="active" :color="color" text-white square shadow>
      <template #left>
        <f-icon icon="feather" />
        <strong class="nv__brand">FusionUI</strong>
      </template>

      <f-navbar-item v-for="c in colors" :id="c" :key="c" class="nv__cap" @click="color = c">
        {{ c }}
      </f-navbar-item>

      <template #right>
        <f-btn variant="text" size="small">Login</f-btn>
      </template>
    </f-navbar>
    <div class="nv__page">Click a color — <code>text-white</code> keeps the labels readable.</div>
  </div>
</template>

<style scoped>
.nv {
  position: relative;
  width: 100%;
  max-width: 660px;
  border-radius: 14px;
  overflow: hidden;
}
.nv__brand {
  margin-left: 6px;
}
.nv__cap {
  text-transform: capitalize;
}
.nv__page {
  display: grid;
  place-items: center;
  height: 120px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
  font-size: 0.85rem;
  opacity: 0.65;
}
.nv__page code {
  background: rgba(var(--fui-theme-on-surface), 0.08);
  padding: 1px 6px;
  border-radius: 5px;
}
</style>
