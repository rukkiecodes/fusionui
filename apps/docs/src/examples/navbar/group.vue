<script setup>
import { ref } from 'vue'
const active = ref('docs')
const docsChild = ref('guide')
const ecoChild = ref('github')
</script>

<template>
  <div class="nv">
    <f-navbar v-model="active" square shadow>
      <template #left>
        <f-icon icon="feather" color="primary" />
        <strong class="nv__brand">FusionUI</strong>
      </template>

      <f-navbar-group id="docs" title="Docs">
        <f-navbar-item :active="docsChild === 'guide'" @click="docsChild = 'guide'"
          >Guide</f-navbar-item
        >
        <f-navbar-item :active="docsChild === 'documents'" @click="docsChild = 'documents'">
          Documents
        </f-navbar-item>
        <f-navbar-item :active="docsChild === 'components'" @click="docsChild = 'components'">
          Components
        </f-navbar-item>
      </f-navbar-group>

      <f-navbar-group id="ecosystem" title="Ecosystem">
        <f-navbar-item header>Social</f-navbar-item>
        <f-navbar-item :active="ecoChild === 'github'" @click="ecoChild = 'github'"
          >Github</f-navbar-item
        >
        <f-navbar-item :active="ecoChild === 'discord'" @click="ecoChild = 'discord'"
          >Discord</f-navbar-item
        >
        <f-navbar-item :active="ecoChild === 'twitter'" @click="ecoChild = 'twitter'"
          >Twitter</f-navbar-item
        >
        <f-navbar-item :active="ecoChild === 'medium'" @click="ecoChild = 'medium'"
          >Medium</f-navbar-item
        >
      </f-navbar-group>

      <f-navbar-item id="license">License</f-navbar-item>

      <template #right>
        <f-btn variant="text" size="small">Login</f-btn>
        <f-btn variant="flat" size="small" color="primary">Get Started</f-btn>
      </template>
    </f-navbar>
    <div class="nv__page">
      Hover <strong>Docs</strong> or <strong>Ecosystem</strong> for the dropdown.
    </div>
  </div>
</template>

<style scoped>
.nv {
  position: relative;
  width: 100%;
  max-width: 660px;
}
.nv__brand {
  margin-left: 6px;
}
.nv__page {
  display: grid;
  place-items: center;
  height: 180px;
  background: rgba(var(--fui-theme-on-surface), 0.03);
  border-radius: 0 0 14px 14px;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
